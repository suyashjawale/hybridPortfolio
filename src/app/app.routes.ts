import { Routes } from '@angular/router';
import { BLOG_LIST } from './components/blogs/blogs.index';
import { PROJECT_LIST } from './components/projects/projects.index';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./components/home/home').then(mod => mod.Home),
    },
    {
        path: 'blogs',
        loadComponent: () => import('./components/blogs/blogs').then(mod => mod.Blogs),
    },
    {
        path: 'blog',
        children: BLOG_LIST.map(blog => ({
            path: blog.slug,
            loadComponent: () => Promise.resolve(blog.loadComponent())
        }))
    },
    {
        path: 'captures',
        loadComponent: () => import('./components/captures/captures').then(mod => mod.Captures),
    },
    {
        path: 'projects',
        loadComponent: () => import('./components/projects/projects').then(mod => mod.Projects),
    },
    {
        path: 'project',
        children: PROJECT_LIST.map(project => ({
            path: project.slug,
            loadComponent: () => Promise.resolve(project.loadComponent())
        }))
    },
    {
        path: 'snippets',
        loadComponent: () => import('./components/snippets/snippets').then(mod => mod.Snippets),
    },
    {
        path: 'wisdom',
        loadComponent: () => import('./components/wisdom/wisdom').then(mod => mod.Wisdom),
    },
    {
        path: 'read',
        loadComponent: () => import('./components/read/read').then(mod => mod.Read),
    },
    {
        path: 'posts',
        loadComponent: () => import('./components/posts/posts').then(mod => mod.Posts),
    },
    {
        path: 'music',
        loadComponent: () => import('./components/music/music').then(mod => mod.Music),
    },
    {
        path: 'search',
        loadComponent: () => import('./components/search/search').then(mod => mod.Search),
    },
    {
        path: 'updates',
        loadComponent: () => import('./components/updates/updates').then(mod => mod.Updates),
    },
    {
        path: 'resume',
        loadComponent: () => import('./components/resume/resume').then(mod => mod.Resume),
    },
    {
        path: 'collection/:name',
        loadComponent: () => import('./components/collection/collection').then(mod => mod.Collection)
    }
];
