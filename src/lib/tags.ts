import { getCollection, type CollectionEntry } from 'astro:content';

export type BlogPost = CollectionEntry<'blog'>;

export function encodeTag(tag: string) {
	return encodeURIComponent(tag);
}

export function decodeTag(param: string) {
	return decodeURIComponent(param);
}

export async function getAllPosts() {
	return (await getCollection('blog')).sort(
		(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
	);
}

export async function getTagMap() {
	const posts = await getAllPosts();
	const map = new Map<string, BlogPost[]>();
	for (const post of posts) {
		for (const tag of post.data.tags ?? []) {
			const list = map.get(tag) ?? [];
			list.push(post);
			map.set(tag, list);
		}
	}
	return map;
}

/** Build Obsidian-like graph: post↔tag edges. */
export async function buildKnowledgeGraph() {
	const posts = await getAllPosts();
	const nodes: {
		id: string;
		label: string;
		kind: 'post' | 'tag';
		href: string;
		group?: string;
	}[] = [];
	const links: { source: string; target: string }[] = [];
	const tagIds = new Set<string>();

	for (const post of posts) {
		const postId = `post:${post.id}`;
		nodes.push({
			id: postId,
			label: post.data.title,
			kind: 'post',
			href: `/blog/${post.id}/`,
			group: (post.data.tags ?? [])[0],
		});
		for (const tag of post.data.tags ?? []) {
			const tagId = `tag:${tag}`;
			if (!tagIds.has(tagId)) {
				tagIds.add(tagId);
				nodes.push({
					id: tagId,
					label: tag,
					kind: 'tag',
					href: `/tags/${encodeURIComponent(tag)}/`,
				});
			}
			links.push({ source: postId, target: tagId });
		}
	}

	return { nodes, links };
}
