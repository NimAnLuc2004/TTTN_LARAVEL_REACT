<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;

class StoreMenuRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255', // Thêm kiểm tra kiểu và độ dài tối đa
            'link' => 'required|max:255', 
            'type' => 'required|string|max:50', // Giới hạn chiều dài cho loại menu
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'Tên không được để trống',
            'name.string' => 'Tên phải là một chuỗi',
            'name.max' => 'Tên không được vượt quá 255 ký tự',

            'link.required' => 'Liên kết không được để trống',

            'link.max' => 'Liên kết không được vượt quá 255 ký tự',

            'type.required' => 'Loại menu không được để trống',
            'type.string' => 'Loại menu phải là một chuỗi',
            'type.max' => 'Loại menu không được vượt quá 50 ký tự',
        ];
    }

    public function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'status' => false,
            'message' => 'Validation errors',
            'menus' => $validator->errors()
        ]));
    }
}
