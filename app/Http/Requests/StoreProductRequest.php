<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;

class StoreProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Chấp nhận mọi yêu cầu
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255', // Tên sản phẩm là bắt buộc, kiểu chuỗi và tối đa 255 ký tự
            'brand_id' => 'required|integer|exists:brands,id', // ID thương hiệu là bắt buộc, kiểu số nguyên và tồn tại trong bảng brands
            'price' => 'required|numeric|min:0', // Giá là bắt buộc, kiểu số và phải lớn hơn hoặc bằng 0
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'Tên không được để trống',
            'name.string' => 'Tên phải là một chuỗi ký tự',
            'name.max' => 'Tên không được vượt quá 255 ký tự',
            'category_id.required' => 'Danh mục là bắt buộc',
            'category_id.integer' => 'ID danh mục phải là một số nguyên',
            'category_id.exists' => 'ID danh mục không tồn tại',
            'brand_id.required' => 'Thương hiệu là bắt buộc',
            'brand_id.integer' => 'ID thương hiệu phải là một số nguyên',
            'brand_id.exists' => 'ID thương hiệu không tồn tại',
            'price.required' => 'Giá là bắt buộc',
            'price.numeric' => 'Giá phải là một số',
            'price.min' => 'Giá phải lớn hơn hoặc bằng 0',
        ];
    }

    public function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'status' => false,
            'message' => 'Validation errors',
            'products' => $validator->errors(),
        ]));
    }
}
