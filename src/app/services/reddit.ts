import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs";

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
}

@Injectable({
    providedIn: 'root'
})


export class RedditService {

    constructor(
        private http: HttpClient
    ) { }


    mapPost(post: any): RedditPostVm {

        const vm: RedditPostVm = {
            id: post.id,
            title: post.title,
            description: post.selftext || '',
            createdUtc: post.created_utc,
            upvotes: post.ups,
            contentType: 'text'
        };

        // Crosspost
        if (post.crosspost_parent_list?.length) {
            vm.contentType = 'crosspost';
            vm.crosspost = post.crosspost_parent_list[0];
            return vm;
        }

        // Reddit Gallery
        if (post.gallery_data?.items?.length) {

            vm.contentType = 'gallery';

            vm.gallery = post.gallery_data.items
                .map((item: any) => {

                    const media =
                        post.media_metadata?.[item.media_id];

                    return media?.s?.u
                        ?.replace(/&amp;/g, '&');
                })
                .filter(Boolean);

            return vm;
        }

        // Reddit Video
        if (
            post.is_video &&
            post.media?.reddit_video?.fallback_url
        ) {

            vm.contentType = 'video';

            vm.video =
                post.media.reddit_video.fallback_url;

            return vm;
        }

        // Youtube
        if (
            post.media?.oembed?.provider_name ===
            'YouTube'
        ) {

            vm.contentType = 'youtube';

            const html =
                post.media.oembed.html;

            const match =
                html.match(/embed\/([^"?]+)/);

            const videoId = match?.[1];

            vm.youtube = {
                embedUrl:
                    `https://www.youtube.com/embed/${videoId}`,
                thumbnail:
                    post.media.oembed.thumbnail_url
            };

            return vm;
        }

        // Single image
        if (
            post.post_hint === 'image' ||
            post.preview?.images?.length
        ) {

            vm.contentType = 'image';

            vm.image =
                post.url_overridden_by_dest ||
                post.preview.images[0].source.url;

            return vm;
        }

        // External website / Github
        if (
            !post.is_self &&
            post.url_overridden_by_dest
        ) {

            vm.contentType = 'link';

            vm.link = {
                url: post.url_overridden_by_dest,
                domain: post.domain,
                image:
                    post.preview?.images?.[0]?.source?.url
            };

            return vm;
        }

        return vm;
    }

    getPosts() {
        return this.http
            .get<any>(
                'https://arctic-shift.photon-reddit.com/api/posts/search?subreddit=developersIndia&link_flair_text=I+Made+This&limit=100&sort=desc'
            )
            .pipe(
                map(res =>
                    res.data.filter((p: any) =>
                        p.selftext !== '[removed]' &&
                        p.selftext !== '[deleted]' &&
                        !p.removed_by_category
                    ).map((p: any) => this.mapPost(p))
                )
            );
    }
}