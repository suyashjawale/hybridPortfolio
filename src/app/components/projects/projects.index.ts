export const PROJECT_LIST = [
    {
        slug: 'instagram-cli',
        title: 'Instagram CLI',
        thumbnail: '/projects/instagram-cli/instagramcli.webp',
        publishedTime: '2026-05-16T11:59:46.006Z',
        summary: 'Python-based command-line tool designed to interact with Instagram by leveraging reverse-engineered API calls to provide functionalities such as posting content, managing followers, and retrieving analytics data.',
        loadComponent: () => import('./instagram-cli/instagram-cli').then(mod => mod.InstagramCLI)
    }
    ,
    {
        slug: 'bmw-atlas',
        title: 'BMW Atlas',
        thumbnail: '/projects/modelx/modelx.png',
        publishedTime: '2026-05-24T07:29:33.991Z',
        summary: 'An interactive map application for visualizing BMW vehicle locations and information.',
        loadComponent: () => import('./bmw-atlas/bmw-atlas').then(mod => mod.BmwAtlas)
    }
    ,
    {
        slug: 'video-sync',
        title: 'Video Sync',
        thumbnail: '/projects/modelx/modelx.png',
        publishedTime: '2026-05-24T07:29:58.571Z',
        summary: 'A tool for synchronizing video content across multiple platforms and devices.',
        loadComponent: () => import('./video-sync/video-sync').then(mod => mod.VideoSync)
    }
    ,
    {
        slug: 'modelx',
        title: 'ModelX',
        thumbnail: '/projects/modelx/modelx.png',
        publishedTime: '2026-05-24T07:30:15.833Z',
        summary: 'A cutting-edge 3D modeling application for creating and visualizing complex architectural designs.',
        loadComponent: () => import('./modelx/modelx').then(mod => mod.Modelx)
    }
];