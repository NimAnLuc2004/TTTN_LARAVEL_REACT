<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;

class StoreProductStoreRequest extends FormRequest
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
            'product_id' => 'required|integer|exists:product_details,id', // Đảm bảo rằng product_id tồn tại
            'price_root' => 'required|numeric',
            'qty'        => 'required|integer',
        ];
    }

    /**
     * Custom validation messages.
     */
    public function messages()
    {
        return [
            'product_id.required' => 'Sản phẩm không được để trống.',
            'product_id.integer'  => 'ID sản phẩm phải là số nguyên.',
            'product_id.exists'   => 'Sản phẩm không tồn tại.',

            'price_root.required' => 'Giá gốc không được để trống.',
            'price_root.numeric'  => 'Giá gốc phải là số.',


            'qty.required' => 'Số lượng không được để trống.',
            'qty.integer'  => 'Số lượng phải là số nguyên.',
        ];
    }

    /**
     * Handle a failed validation attempt.
     */
    public function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'status'   => false,
            'message'  => 'Có lỗi xác thực dữ liệu.',
            'errors'   => $validator->errors()
        ], 422));
    }
}
