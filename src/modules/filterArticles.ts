import { PrioritizedList } from "./PrioritizedList";

interface IArticle {
    id: number,
    title: string,
    content: string
}

export const filterArticles = (articles: IArticle[], searchQuery: string) => {
    let prioritizedArticles = new PrioritizedList()
    searchQuery = searchQuery.toLowerCase()

    articles.forEach(article => {
        let title = article.title.toLowerCase()
        if(title.includes(searchQuery)) {
            let numNotMatched = title.length - searchQuery.length
            if(title.startsWith(searchQuery)) {
                prioritizedArticles.list.push({
                    priority: [
                        2,
                        -numNotMatched
                    ],
                    val: article
                })
            }
            else {
                prioritizedArticles.list.push({
                    priority: [
                        1,
                        -numNotMatched
                    ],
                    val: article
                })
            }
        }
    })
    
    return prioritizedArticles.sort().values
}