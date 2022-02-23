<script setup lang="ts">
import axios from 'axios'

import Article from './components/Article.vue'
import Navigation from './components/Navigation.vue'
import { computed, onMounted, provide, reactive, ref } from 'vue'

import { filterArticles } from './modules/filterArticles'
import { UPDATE_SNIPPET_INTERVAL_MSEC, URL_SNIPPET_MANAGER_API } from './config'


interface IArticle {
    id: number,
    title: string,
    content: string
}


const writeClipboard = {
    articleByIndex: (index: number) => {
        if(filteredArticles.value.length <= index) return
        window.systemClipboard.write(filteredArticles.value[index].content)
    },
    articleById: (id: number) => {
        let article = filteredArticles.value
            .find(article => article.id == id)

        if(article === undefined) return
        window.systemClipboard.write(article.content)
    }
}

provide('writeClipboard', writeClipboard)


const articles = ref<IArticle[]>([])

const storage = {
    get articles() {
        let data = localStorage.getItem('articles')
        if(data == null) return data
        return JSON.parse(data)
    },
    set articles(val) {
        if(typeof val !== 'string')
            val = JSON.stringify(val)
        localStorage.setItem('articles', val)
    }
}


const mapArticlesFromApi = (data): IArticle[] => {
    return data.map(article => 
        ({
            id: article.id,
            title: article.title,
            content: article.content
        }))
}

const fetchArticles = async () => {
    let res;
    try {
        res = await axios.get(`${URL_SNIPPET_MANAGER_API}/snippet`)
    } catch (error) {
        return
    }

    if(res == undefined || res.status != 200) return
    let articlesApi = mapArticlesFromApi(res.data)

    if(JSON.stringify(storage.articles) != JSON.stringify(articlesApi)) {
        storage.articles = articlesApi
        articles.value = articlesApi
    }
}


const wait = (msec: number) => new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(null)
    }, msec)
})

const autoUpdateArticles = async () => {
    while(1) {
        fetchArticles()
        await wait(UPDATE_SNIPPET_INTERVAL_MSEC)
    }
}

onMounted(async () => {
    if(storage.articles != null)
        articles.value = storage.articles

    autoUpdateArticles()
})


const searchQuery = ref("")

const filteredArticles = computed<IArticle[]>(() => {
    if (searchQuery.value.length == 0)
        return articles.value

    return filterArticles(articles.value, searchQuery.value)
})

const noArticles = computed<boolean>(() => filteredArticles.value.length == 0)

</script>

<template>
    <div class="min-h-screen p-12 bg-zinc-50 select-none">
        <Navigation @searchUpdate="(query) => searchQuery = query"></Navigation>
        <section class="py-6 space-y-6">
            <section class="grid grid-cols-3 gap-4">
                <Article
                    v-for="article in filteredArticles"
                    :key="article.id"
                    :id="article.id"
                    :title="article.title"
                    :content="article.content"
                ></Article>
                <article 
                    v-if="noArticles"
                    class="p-3 bg-gray-200 rounded-2xl shadow-[inset_0px_4px] shadow-gray-300 overflow-hidden"
                >
                    <span class="font-verdana text-xl"> No snippets to show </span>
                </article>
            </section>
        </section>
    </div>
</template>