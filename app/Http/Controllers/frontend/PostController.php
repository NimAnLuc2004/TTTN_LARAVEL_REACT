<?php

namespace App\Http\Controllers\frontend;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function post_page($slug)
    {
        $posts = Post::where([['post.status', '=', 1], ['post.type', '=', 'page'], ['post.slug', $slug]])
            ->orderBy('post.created_at', 'DESC')    
            ->join('topic', 'post.topic_id', '=', 'topic.id')
            ->select("post.id", "post.title", "topic.id as topicid", "post.thumbnail", "post.content", "post.description")
            ->first();
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'pages' => $posts
        ];
        return response()->json($result);
    }
    public function post_new($limit)
    {
        $posts = Post::where([['post.status', '=', 1], ['post.type', '=', 'post']])
            ->orderBy('post.created_at', 'DESC')
            ->join('topic', 'post.topic_id', '=', 'topic.id')
            ->select("post.id","post.slug", "topic.id as topicid", "post.title", "topic.name as topicname", "post.thumbnail", "post.description", "post.created_at")
            ->limit($limit)
            ->get();
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'posts' => $posts
        ];
        return response()->json($result);
    }
    public function post_all()
    {
        //
    }
    public function post_detail($slug, $limit)
    {
        $post = Post::where([['post.status', '=', 1], ['post.type', '=', 'post'], ['post.slug', $slug]])
            ->join('topic', 'post.topic_id', '=', 'topic.id')
            ->select("post.id", "topic.id as topicid", "post.title", "topic.name as topicname", "post.thumbnail", "post.content", "post.description", "post.created_at")
            ->first();

        if ($post) {
            $relatedPosts = Post::where([['post.status', '=', 1], ['post.topic_id', '=', $post->topicid]])
                ->where('post.id', '!=', $post->id)
                ->orderBy('post.created_at', 'DESC')
                ->select("post.id", "post.title", "post.thumbnail", "post.description", "post.slug")
                ->limit($limit)
                ->get();

            $result = [
                'status' => true,
                'message' => 'Tải dữ liệu thành công',
                'posts' => $post,
                'related_posts' => $relatedPosts
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Bài viết không tồn tại'
            ];
        }

        return response()->json($result);
    }
}
