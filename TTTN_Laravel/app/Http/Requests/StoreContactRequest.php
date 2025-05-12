<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;

class StoreContactRequest extends FormRequest
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
            'email' => 'required|email|max:255', // Thêm kiểm tra định dạng email và độ dài tối đa
            'phone' => 'required|string|max:20', // Giới hạn chiều dài cho số điện thoại
            'title' => 'required|string|max:255', // Thêm kiểm tra kiểu và độ dài tối đa
            'content' => 'required|string', // Có thể thêm các điều kiện khác nếu cần
            'user_id' => 'required|integer', // Kiểm tra kiểu cho user_id
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'Tên không được để trống',
            'name.string' => 'Tên phải là một chuỗi',
            'name.max' => 'Tên không được vượt quá 255 ký tự',
            
            'email.required' => 'Email không được để trống',
            'email.email' => 'Email không hợp lệ',
            'email.max' => 'Email không được vượt quá 255 ký tự',
            
            'phone.required' => 'Số điện thoại không được để trống',
            'phone.string' => 'Số điện thoại phải là một chuỗi',
            'phone.max' => 'Số điện thoại không được vượt quá 20 ký tự',
            
            'title.required' => 'Tiêu đề không được để trống',
            'title.string' => 'Tiêu đề phải là một chuỗi',
            'title.max' => 'Tiêu đề không được vượt quá 255 ký tự',
            
            'content.required' => 'Nội dung không được để trống',
            'content.string' => 'Nội dung phải là một chuỗi',
            
            'user_id.required' => 'ID người dùng không được để trống',
            'user_id.integer' => 'ID người dùng phải là một số nguyên',
        ];
    }

    public function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'status' => false,
            'message' => 'Validation errors',
            'contacts' => $validator->errors()
        ]));
    }
}
