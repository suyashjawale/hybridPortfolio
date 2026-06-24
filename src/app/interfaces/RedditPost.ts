export type RedditContentType =
    | 'text'
    | 'image'
    | 'gallery'
    | 'video'
    | 'youtube'
    | 'link'
    | 'crosspost';

export interface RedditPostVm {
    id: string;
    title: string;
    description: string;
    createdUtc: number;
    upvotes: number;

    contentType: RedditContentType;

    image?: string;
    gallery?: string[];

    video?: string;

    youtube?: {
        embedUrl: string;
        thumbnail: string;
    };

    link?: {
        url: string;
        domain: string;
        image?: string;
    };

    crosspost?: any;
};