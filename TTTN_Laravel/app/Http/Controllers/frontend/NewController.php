<?php

namespace App\Http\Controllers\frontend;

use App\Http\Controllers\Controller;
use App\Models\News;
use App\Models\NewsComment;
use App\Models\NewsCommentReaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NewController extends Controller
{
    /**
     * Làm sạch chuỗi để đảm bảo UTF-8 hợp lệ
     */
    private function cleanString($string)
    {
        if (is_null($string)) {
            return null;
        }
        // Loại bỏ ký tự không hợp lệ và đảm bảo UTF-8
        return mb_convert_encoding(
            preg_replace('/[^\x{0009}\x{000a}\x{000d}\x{0020}-\x{D7FF}\x{E000}-\x{FFFD}]+/u', '', $string),
            'UTF-8',
            'UTF-8'
        );
    }

    public function new_list($limit)
    {
        $news_list = News::where('status', 1)
            ->orderBy('created_at', 'ASC')
            ->select('id', 'title', 'content', 'created_at', 'image', 'topic_id')
            ->with(['topic' => function ($query) {
                $query->select('id', 'name');
            }])
            ->limit($limit)
            ->get()
            ->map(function ($news) {
                return [
                    'id' => $news->id,
                    'title' => $this->cleanString($news->title),
                    'image' => $news->image,
                    'content' => $this->cleanString($news->content),
                    'description' => $this->cleanString(substr($news->content, 0, 100)) . '...',
                    'created_at' => $news->created_at,
                    'topic' => $news->topic ? [
                        'id' => $news->topic->id,
                        'name' => $this->cleanString($news->topic->name)
                    ] : null,
                ];
            });

        return response()->json([
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'news_list' => $news_list
        ]);
    }

    public function new_detail($id)
    {
        $news = News::where('status', 1)
            ->where('id', $id)
            ->with(['topic' => function ($query) {
                $query->select('id', 'name');
            }])
            ->select('id', 'title', 'content', 'created_at', 'image', 'topic_id')
            ->first();

        if (!$news) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy tin tức'
            ], 404);
        }

        $result = [
            'id' => $news->id,
            'title' => $this->cleanString($news->title),
            'image' => $news->image,
            'content' => $this->cleanString($news->content),
            'created_at' => $news->created_at,
            'topic' => $news->topic ? [
                'id' => $news->topic->id,
                'name' => $this->cleanString($news->topic->name)
            ] : null,
        ];

        return response()->json([
            'status' => true,
            'message' => 'Lấy chi tiết thành công',
            'news' => $result
        ]);
    }

    public function new_list1($limit, $topic_id)
    {
        $news_list = News::where('status', 1)
            ->where('topic_id', $topic_id)
            ->orderBy('created_at', 'ASC')
            ->select('id', 'title', 'image', 'content', 'created_at', 'topic_id')
            ->with(['topic' => function ($query) {
                $query->select('id', 'name');
            }])
            ->limit($limit)
            ->get()
            ->map(function ($news) {
                return [
                    'id' => $news->id,
                    'title' => $this->cleanString($news->title),
                    'image' => $news->image,
                    'description' => $this->cleanString(substr($news->content, 0, 100)) . '...',
                    'created_at' => $news->created_at,
                    'topic' => $news->topic ? [
                        'id' => $news->topic->id,
                        'name' => $this->cleanString($news->topic->name)
                    ] : null,
                ];
            });

        return response()->json([
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'news_list' => $news_list
        ]);
    }

    public function getTopics()
    {
        $topics = \App\Models\NewsTopic::select('id', 'name')
            ->orderBy('name', 'ASC')
            ->get()
            ->map(function ($topic) {
                return [
                    'id' => $topic->id,
                    'name' => $this->cleanString($topic->name)
                ];
            });

        return response()->json([
            'status' => true,
            'message' => 'Lấy danh sách danh mục thành công',
            'topics' => $topics
        ]);
    }
    public function getComments($news_id)
    {
        $comments = NewsComment::where('news_id', $news_id)
            ->with(['user:id,name', 'reactions'])
            ->orderBy('created_at', 'DESC')
            ->get()
            ->map(function ($comment) {
                return [
                    'id' => $comment->id,
                    'user_id' => $comment->user_id,
                    'user_name' => $comment->user->name ?? 'Ẩn danh',
                    'comment' => $this->cleanString($comment->comment),
                    'created_at' => $comment->created_at,
                    'updated_at' => $comment->updated_at,
                    'reactions' => $comment->reactions->groupBy('reaction')->map->count()
                ];
            });

        return response()->json([
            'status' => true,
            'message' => 'Lấy danh sách bình luận thành công',
            'comments' => $comments
        ]);
    }

    /**
     * Thêm bình luận mới
     */
    public function addComment(Request $request, $news_id)
    {
        $request->validate([
            'comment' => 'required|string|max:1000'
        ]);

        $user_id = Auth::id();

        if (!$user_id) {
            return response()->json([
                'status' => false,
                'message' => 'Bạn cần đăng nhập để bình luận.'
            ], 401);
        }

        try {
            $comment = NewsComment::create([
                'user_id' => $user_id,
                'news_id' => $news_id,
                'comment' => $request->comment
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Bình luận đã được thêm',
                'comment' => [
                    'id' => $comment->id,
                    'user_id' => $comment->user_id,
                    'comment' => $this->cleanString($comment->comment),
                    'created_at' => $comment->created_at->toISOString(),
                    'updated_at' => $comment->updated_at->toISOString()
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Không thể thêm bình luận: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Thêm/xóa reaction cho bình luận
     */
    public function toggleReaction(Request $request, $comment_id)
    {
        $request->validate([
            'reaction' => 'required|string|in:like,dislike'
        ]);

        $user_id = Auth::id();

        if (!$user_id) {
            return response()->json([
                'status' => false,
                'message' => 'Bạn cần đăng nhập để thêm reaction.'
            ], 401);
        }

        try {
            $reaction = $request->reaction;

            // Kiểm tra xem user đã reaction chưa
            $existingReaction = NewsCommentReaction::where('user_id', $user_id)
                ->where('comment_id', $comment_id)
                ->first();

            if ($existingReaction) {
                if ($existingReaction->reaction === $reaction) {
                    // Nếu đã tồn tại reaction giống nhau thì xóa
                    $existingReaction->delete();
                    $action = 'removed';
                } else {
                    // Nếu reaction khác thì cập nhật
                    $existingReaction->update([
                        'reaction' => $reaction,
                        'updated_at' => now() // Cập nhật thời gian thủ công nếu cần
                    ]);
                    $action = 'updated';
                }
            } else {
                // Thêm reaction mới
                $newReaction = NewsCommentReaction::create([
                    'user_id' => $user_id,
                    'comment_id' => $comment_id,
                    'reaction' => $reaction
                ]);
                $action = 'added';
            }

            // Lấy số lượng reaction mới nhất
            $reactions = NewsCommentReaction::where('comment_id', $comment_id)
                ->get()
                ->groupBy('reaction')
                ->map->count();

            // Lấy thông tin bình luận để trả về created_at và updated_at
            $comment = NewsComment::find($comment_id);

            return response()->json([
                'status' => true,
                'message' => 'Reaction đã được ' . $action,
                'reactions' => $reactions,
                'comment' => [
                    'id' => $comment->id,
                    'created_at' => $comment->created_at->toISOString(),
                    'updated_at' => $comment->updated_at->toISOString()
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Không thể xử lý reaction: ' . $e->getMessage()
            ], 500);
        }
    }
}
