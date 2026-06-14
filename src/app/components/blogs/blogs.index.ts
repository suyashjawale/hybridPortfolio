export const BLOG_LIST = [
    {
        slug: 'lifecycle-of-milk',
        title: 'Lifecycle of Milk',
        thumbnail: '/blogs/lifecycle-of-milk/pexels-chevanon-302901.jpg',
        publishedTime: '2026-05-16T11:59:54.778Z',
        modifiedTime: '2026-05-16T11:59:54.780Z',
        summary: 'Explaining all the stages of milk production, from the cow to the consumer',
        loadComponent: () => import('./lifecycle-of-milk/lifecycle-of-milk').then(mod => mod.LifecycleOfMilk)
    }
];