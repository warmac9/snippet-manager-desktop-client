<script setup lang="ts">
import Navigation from './components/Navigation.vue'
import Article from './components/Article.vue'
import { computed, provide, reactive, ref } from 'vue'

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


const articles: Article[] = reactive([
    {
        id: 1,
        title: 'skapo',
        content: 'aaa'
    },
    {
        id: 2,
        title: 'skap',
        content: 'bbb'
    },
    {
        id: 3,
        title: 'kap',
        content: 'ccc'
    },
    {
        id: 4,
        title: 'kapo',
        content: 'ddd'
    },
])


const searchQuery = ref("")

const filteredArticles = computed<Article[]>(() => {
    if (searchQuery.value.length == 0)
        return articles

    let prioritizedArticles: PrioritizedArticle[] = []

    articles.forEach(article => {
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
            </section>
            <span v-if="noArticles" class="p-5 text-3xl text-gray-500">No snippets to show</span>
        </section>
    </div>
</template>