<script setup lang="ts">
import axios from 'axios'

import Article from './components/Article.vue'
import Navigation from './components/Navigation.vue'
import { filterArticles } from './modules/filterArticles'
import { computed, onMounted, provide, ref } from 'vue'

const isProduction: boolean = import.meta.env.PROD
const URL_SNIPPET_MANAGER_API = isProduction ? 'https://localhost:7137/api' : 'https://localhost:7137/api'

interface IArticle {
    id: number,
    title: string,
    content: string
}


const writeClipboard = {
    articleByIndex: (index: number) => {
        if(index < 0 || filteredArticles.value.length <= index) return
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


var token;


const mapArticlesFromApi = (data): IArticle[] => {
    return data.map(article => 
        ({
            id: article.id,
            title: article.title,
            content: article.content
        }))
}

const fetchArticles = async () => {
    let res
    let articlesApi = [];
    try {
        res = await axios.get(`${URL_SNIPPET_MANAGER_API}/snippet`, { timeout: 2000 })
        if(res == undefined || res.status != 200) return
        articlesApi = mapArticlesFromApi(res.data)
    } catch (error) {
        console.log(error)
        return
    }

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
        await wait(2000)
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