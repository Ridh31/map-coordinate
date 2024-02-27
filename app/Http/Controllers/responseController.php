<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class responseController extends Controller
{
    //
    // class reponse  success
    public static function success($result){

        return response()->json(
                                [
                                    'status' => 200,
                                    'result'=> $result
                                ],200);
    }
    public static function success_($result,$btn){

        return response()->json(
                                [
                                    'status'    => 200,
                                    'result'    => $result,
                                    'btn'       => $btn
                                ],200);
    }


    public static function successTotal($result){

        return response()->json(
                                [
                                    'status' => 200,
                                    'total'=> count($result),
                                    'result'=> $result
                                ],200);
    }

    // class reponse  client error
    public static function client($result){

        return response()->json(
                                [
                                    'status' => 400,
                                    'result'=> $result
                                ],400);
    }

    // class reponse  code  error
    public static function error($result){

        return response()->json(
                                [
                                    'status' => 500,
                                    'result'=> $result
                                ],500);
    }

    //class reponse  code  error when detail data
    public static function errorDetail($result){

        $data=array(['error'=>'ID Not Found : '.$result]);
        return response()->json(
                                [
                                    'status' => 400,
                                    'result'=> $data
                                ],400);
    }

    public static function errorString($result)
    {
        $sm=array(['error'=>'The id must be a number : '.$result]);
        return response()->json(
            [
                'stastu' => 400,
                'result' =>$sm
            ],400);
    }
    public static function errorUnique($result)
    {
        $sm=array(['error'=> "The '$result' has already been taken."]);
        return response()->json(
            [
                'stastu' => 400,
                'result' =>$sm
            ],400);
    }
    // class reponse not found
    public static function notFound($field){

        return response()->json(
            [
                'status' => 400,
                'result'=> $field.' is not found'
            ],
            400
        );
    }


    /**
     * Response Data from Laravel Pagination
     * 
     * @param   int|required    $total
     * @param   array|required  $result
     * */ 
    public static function pagination($total = 0, $result = []) : object {
        
        return response()->json(
            [
                'status' => 200,
                'total' => $total,
                'result'=> $result
            ],
            200
        );
    }
}
