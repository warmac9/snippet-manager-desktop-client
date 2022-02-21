<script setup lang="ts">
import axios from 'axios'
import Navigation from './components/Navigation.vue'
import Article from './components/Article.vue'
import { computed, onMounted, provide, reactive, ref } from 'vue'
import { UPDATE_SNIPPET_INTERVAL_MSEC, URL_SNIPPET_MANAGER_API } from './config'

interface Article {
    id: number,
    title: string,
    content: string
}

interface PrioritizedArticle {
    priority: number[],
    article: Article
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


const articles = ref<Article[]>([])

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

const mapArticlesFromApi = (data): Article[] => {
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

const filteredArticles = computed<Article[]>(() => {
    if (searchQuery.value.length == 0)
        return articles.value

    let prioritizedArticles: PrioritizedArticle[] = []

    articles.value.forEach(article => {
        if(article.title.includes(searchQuery.value)) {
            let numNotMatched = article.title.length - searchQuery.value.length
            if(article.title.startsWith(searchQuery.value))
                prioritizedArticles.push({
                    priority: [
                        2,
                        -numNotMatched
                    ],
                    article: article
                })
            else
                prioritizedArticles.push({
                    priority: [
                        1,
                        -numNotMatched
                    ],
                    article: article
                })
        }
    })

    return prioritizedArticles
        .sort(({ priority: a }, { priority: b }) => {
            for (let index = 0; index < Math.min(a.length, b.length); index++) {
                if(a[index] == b[index]) continue
                return a[index] > b[index] ? -1 : 1
            }
            return -1
        })
        .map(priorityArticle => priorityArticle.article)
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