<script setup lang="ts">
import Navigation from './components/Navigation.vue'
import Article from './components/Article.vue'
import { reactive, ref, computed } from 'vue'

interface Article {
    id: number,
    title: string,
    content: string
}

interface PrioritizedArticle {
    priority: number[],
    article: Article
}

const text = 'It was a cool scene to do. In a scene like this with such \n\n complexity, in order for everyo\nne to get a sort of base of \n organizati­on that they can work from, you have to storyboard.'

const articles: Article[] = reactive([
    {
        id: 1,
        title: 'skapo',
        content: text
    },
    {
        id: 2,
        title: 'skap',
        content: text
    },
    {
        id: 4,
        title: 'kap',
        content: text
    },
    {
        id: 3,
        title: 'kapo',
        content: text
    },
    {
        id: 3,
        title: 'kapor',
        content: text
    },
    ...Array(10).fill({
        id: 3,
        title: 'kako',
        content: text
    })
])

const searchQuery = ref("")

const filteredArticles = computed<Article[]>(() => {
    if (searchQuery.value.length == 0)
        return articles

    if (searchQuery.value.length == 1)
        return articles
            .filter((article) => article.title.startsWith(searchQuery.value))

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
                    :title="article.title"
                    :content="article.content"
                ></Article>
            </section>
            <span v-if="noArticles" class="p-5 text-3xl text-gray-500">No snippets to show</span>
        </section>
    </div>
</template>