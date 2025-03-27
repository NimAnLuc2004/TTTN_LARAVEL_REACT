<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;

class StoreProductSaleRequest extends FormRequest
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
            'product_id' => 'required|integer|exists:product,id', // ID sản phẩm là bắt buộc, kiểu số nguyên và phải tồn tại trong bảng products
            'price_sale' => 'required|numeric|min:0', // Giá bán là bắt buộc, kiểu số và không nhỏ hơn 0
        ];
    }

    public function messages()
    {
        return [
            'product_id.required' => 'ID sản phẩm không được để trống',
            'product_id.integer' => 'ID sản phẩm phải là một số nguyên',
            'product_id.exists' => 'ID sản phẩm không tồn tại',
            'price_sale.required' => 'Giá bán không được để trống',
            'price_sale.numeric' => 'Giá bán phải là một số',
            'price_sale.min' => 'Giá bán phải lớn hơn hoặc bằng 0',
        ];
    }

    public function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'status' => false,
            'message' => 'Validation errors',
            'productsales' => $validator->errors(),
        ]));
    }
}
