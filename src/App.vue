<script setup lang="ts">
import axios from 'axios'

import Article from './components/Article.vue'
import Navigation from './components/Navigation.vue'
import LoginForm from './components/LoginForm.vue';
import { filterArticles } from './modules/filterArticles'
import { computed, onMounted, provide, ref } from 'vue'

const isProduction: boolean = import.meta.env.PROD
axios.defaults.baseURL = isProduction ? 'https://localhost:7137/api' : 'https://localhost:7137/api'

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


const storage = {
    get articles() {
        return window.systemStorage.getArticles()
    },
    set articles(val) {
        window.systemStorage.setArticles(val)
    },

    get token() {
        return window.systemStorage.getToken()
    },
    set token(val) {
        window.systemStorage.setToken(val)
    },

    get email() {
        return window.systemStorage.getEmail()
    },
    set email(val) {
        window.systemStorage.setEmail(val)
    },

    get password() {
        return window.systemStorage.getPassword()
    },
    set password(val) {
        window.systemStorage.setPassword(val)
    }
}


const validCreds = ref<boolean>(true)
const credsEmail = ref<string>('')
const credsPassword = ref<string>('')

const axiosSetToken = (token: string) => {
    if(typeof token == 'string')
        axios.defaults.headers.common = { 'Authorization': `Bearer ${token}` }
}

const fetchToken = async (email: string, password: string) =>
    await axios.post('/account/login', { email: email, password: password })

const validateCreds = async(email: string, password: string) => {
    let res = await fetchToken(email, password)
    if(res?.status != 200) return

    credsEmail.value = email
    credsPassword.value = password
    axiosSetToken(res.data)

    storage.email = email
    storage.password = password
    storage.token = res.data

    validCreds.value = true
}


const articles = ref<IArticle[]>([])

const mapArticlesFromApi = (data): IArticle[] => {
    return data.map(article => 
        ({
            id: article.id,
            title: article.title,
            content: article.content
        }))
}

const updateArticles = async () => {
    let res = await axios.get('/snippet', { timeout: 2000 })
        .catch(async (error) => {
            if(!error?.response?.status) return
            if(error.response.status == 401) {
                let resToken = await fetchToken(credsEmail.value, credsPassword.value)
                    .catch(error => {
                        if(!error?.response?.status) return
                        if(error.response.status == 401 || error.response.status == 400) {
                            validCreds.value = false
                        }
                        else
                            console.error('Authorization post method failed')
                    })
                if(resToken?.status != 200) return
                axiosSetToken(resToken.data)
                res = await axios.get('/snippet', { timeout: 2000 })
            }
        })

    if(res?.status != 200) return
    let articlesApi = mapArticlesFromApi(res.data)
    if(JSON.stringify(await storage.articles) != JSON.stringify(articlesApi)) {
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
        if(validCreds.value) {
            try {
                await updateArticles()
            } catch (error) {}
        }
        await wait(2000)
    }
}

onMounted(async () => {
    axiosSetToken(await storage.token)
    credsEmail.value = await storage.email
    credsPassword.value = await storage.password

    if(await storage.articles != undefined)
        articles.value = await storage.articles

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
    <div 
        class="min-h-screen p-12 bg-zinc-50 select-none"
        v-if="!validCreds"
    >
        <LoginForm @validateCreds="(email, password) => validateCreds(email, password)"></LoginForm>
    </div>
    <div 
        class="min-h-screen p-12 bg-zinc-50 select-none"
        v-if="validCreds"
    >
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