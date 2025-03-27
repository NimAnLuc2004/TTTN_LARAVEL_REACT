<?php

namespace App\Http\Controllers\frontend;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Menu;
use App\Models\Category;
use App\Models\Topic;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    public function menu_list($id, $limit)
    {
        $menus = Menu::where([['status', '=', 1], ['position', '=', 'mainmenu']])
            ->orderBy('created_at', 'ASC')
            ->select("id", "name", "link", "type", "position", "status", "table_id")
            ->limit($limit)
            ->get();

        $categories = [];

        foreach ($menus as $menu) {
            if ($menu->type === "category") {
                // Lấy danh mục cha
                $parentCategory = Category::where([
                    ['id', '=', $menu->table_id],
                    ['status', '=', 1],
                    ['parent_id', '=', 0]
                ])
                ->select("id", "name", "slug")
                ->first();

                if ($parentCategory) {
                    $subcategories = $this->getSubcategories($parentCategory->id, $limit);

                    // Thêm danh mục con cấp sâu vào mảng
                    $categories = array_merge($categories, $subcategories);
                }
            }
        }

        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'menus' => $menus,
            'categories' => $categories
        ];

        return response()->json($result);
    }

    // Hàm đệ quy để lấy tất cả danh mục con
    private function getSubcategories($parentId, $limit)
    {

        $subcategories = Category::where([
            ['parent_id', '=', $parentId],
            ['status', '=', 1]
        ])
        ->orderBy('created_at', 'ASC')  
        ->select("id", "name", "slug")
        ->limit($limit)
        ->get()
        ->toArray();
        foreach ($subcategories as &$subcategory) {
            $childCategories = $this->getSubcategories($subcategory['id'], $limit);
            if (!empty($childCategories)) {
                $subcategory['subcategories'] = $childCategories;
            }
        }

        return $subcategories;
    }
    public function menu_footer()
    {
        $menus = Menu::where([['status', '=', 1], ['position', '=', 'footermenu']])
            ->orderBy('created_at', 'ASC')
            ->select("id", "name", "link", "type", "position", "status", "table_id")
            ->get();

        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'menus' => $menus,
        ];

        return response()->json($result);
    }
}