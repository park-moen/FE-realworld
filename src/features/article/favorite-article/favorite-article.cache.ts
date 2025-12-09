import { ArticleSchema, ArticlesSchema } from '~entities/article/article.contracts';
import type { Article, Articles } from '~entities/article/article.type';

export function updateArticleInCache(rawData: unknown, slug: string, updater: (article: Article) => Article): unknown {
  if (!rawData) {
    return rawData;
  }

  const { data: article } = ArticleSchema.safeParse(rawData);
  if (article && article.slug === slug) {
    return updater(article);
  }

  const { data: articlesData } = ArticlesSchema.safeParse(rawData);
  if (articlesData && articlesData.articles[slug]) {
    const { articles, articlesCount } = articlesData;

    return {
      articles: {
        ...articles,
        [slug]: updater(articles[slug]),
      },
      articlesCount,
    } as Articles;
  }

  return rawData;
}
