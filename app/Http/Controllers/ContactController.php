<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Contact;
use App\Http\Requests\StoreContactRequest;
use App\Http\Requests\UpdateContactRequest;

class ContactController extends Controller
{
    public function index()
    {
        $contacts = Contact::where('contacts.status', '!=', 0)
            ->join('users', 'contacts.user_id', '=', 'users.id')
            ->orderBy('contacts.created_at', 'DESC')
            ->select("contacts.id","contacts.name", "contacts.user_id", "contacts.title", "contacts.status", "users.name as username", "contacts.phone", "contacts.email")
            ->get();
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'contacts' => $contacts
        ];
        return response()->json($result);
    }
    public function trash()
    {
        $contacts = Contact::where('contacts.status', '=', 0)
            ->join('users', 'contacts.user_id', '=', 'users.id')
            ->contactBy('contacts.created_at', 'DESC')
            ->select("contacts.id", "contacts.user_id", "contacts.title", "contacts.status", "users.name as username", "contacts.phone", "contacts.email")
            ->get();
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'contacts' => $contacts
        ];
        return response()->json($result);
    }
    public function show($id)
    {
        $contact = Contact::find($id);
        if ($contact == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'contact' => $contact
            ];
        } else {
            $result = [
                'status' => true,
                'message' => 'Tải dữ liệu thành công',
                'contact' => $contact
            ];
        }
        return response()->json($result);
    }
    public function replay(StoreContactRequest $request) {}
    public function update(Request $request,$id)
    {
        $contact = Contact::find($id);
        if($contact==null)
        {
            $result =[
                'status'=>false,
                'message'=>'Không tìm thấy thông tín',
                'contact'=>null
            ];
            return response()->json($result);
        }
        $contact->name =  $request->name;

        $contact->email =  $request->email;
        $contact->phone =  $request->phone;
        $contact->title =  $request->title;
        $contact->content =  $request->content;
        $contact->updated_by =  1;
        $contact->updated_at =  date('Y-m-d H:i:s');
        $contact->status =  $request->status;
        if($contact->save())
        {
            $result =[
                'status'=>true,
                'message'=>'Cập nhật thành công',
                'contact'=>$contact
            ];
        }
        else
        {
            $result =[
                'status'=>false,
                'message'=>'Không thể cập nhật',
                'contact'=>null
            ];
        }
        return response()->json($result);
    }

    public function status($id)
    {
        $contact = Contact::find($id);
        if ($contact == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'contact' => null
            ];
            return response()->json($result);
        }
        $contact->status = ($contact->status == 1) ? 2 : 1;
        $contact->updated_by =  1;
        $contact->updated_at =  date('Y-m-d H:i:s');
        if ($contact->save()) {
            $result = [
                'status' => true,
                'message' => 'Thay đổi thành công',
                'contact' => $contact
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể thay đổi',
                'contact' => null
            ];
        }
        return response()->json($result);
    }

    public function delete($id)
    {
        $contact = Contact::find($id);
        if ($contact == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'contact' => null
            ];
            return response()->json($result);
        }
        $contact->status = 0;
        $contact->updated_by =  1;
        $contact->updated_at =  date('Y-m-d H:i:s');
        if ($contact->save()) {
            $result = [
                'status' => true,
                'message' => 'Thay đổi thành công',
                'contact' => $contact
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể thay đổi',
                'contact' => null
            ];
        }
        return response()->json($result);
    }
    public function restore($id)
    {

        $contact = Contact::find($id);
        if ($contact == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'contact' => null
            ];
            return response()->json($result);
        }
        $contact->status = 2;
        $contact->updated_by =  1;
        $contact->updated_at =  date('Y-m-d H:i:s');
        if ($contact->save()) {
            $result = [
                'status' => true,
                'message' => 'Thay đổi thành công',
                'contact' => $contact
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể thay đổi',
                'contact' => null
            ];
        }
        return response()->json($result);
    }

    public function destroy($id)
    {
        $contact = Contact::find($id);
        if ($contact == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy thông tin',
                'contact' => null
            ];
            return response()->json($result);
        }
        if ($contact->delete()) {
            $result = [
                'status' => true,
                'message' => 'Xóa thành công',
                'contact' => $contact
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể xóa',
                'contact' => null
            ];
        }
        return response()->json($result);
    }
    public function store(Request $request)
    {
           $contact = new Contact();
           $contact->name =  $request->name;
           $contact->title =  $request->title;
           $contact->email =  $request->email;
           $contact->phone =  $request->phone;
           $contact->phone =  $request->title;
           $contact->content =  $request->content;
           $contact->user_id =  $request->user_id;
           $contact->replay_id =  0;

           $contact->created_at =  date('Y-m-d H:i:s');
           $contact->status =  1;
           if($contact->save())
           {
               $result =[
                   'status'=>true,
                   'message'=>'Thêm thành công',
                   'contact'=>$contact
               ];
           }
           else
           {
               $result =[
                   'status'=>false,
                   'message'=>'Không thể thêm',
                   'contact'=>null
               ];
           }
           return response()->json($result);
   }
}
