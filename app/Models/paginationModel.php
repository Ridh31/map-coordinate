<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Exception;
use App\Http\Controllers\responseController;
class paginationModel extends Model
{
    use HasFactory;

    public  static function showPage($query,$show,$condition,$group,$short,$page,$search)
    {
        if(isset($query))
        {
            DB::beginTransaction();
            try
            {
                $offset=($page - 1) * $show;
                $result_page='';
                $result_page="limit $show offset $offset";


                $total_result = [];
                $result_total = [];
                $result_total_search = [];

                if($page==null  && $show==null)
                {
                    if($search==null)
                    {
                        if($condition!=null)
                        {
                            $total_result=DB::select($query."$condition"." $group");
                            $result_total=DB::select($query."$condition"." "."$group"." "."  $short"." ");
                            $result_total_search=DB::select($query."$group"." "."  $short"." ");
                        }
                        else
                        {
                            $total_result=DB::select($query."$group");
                            $result_total=DB::select($query."$group"." "."  $short"." ");
                            $result_total_search=DB::select($query."$group"." "."  $short"." ");
                            // dd('iiiiiiiiiiiiiii',$total_result);

                        }

                    }
                    else
                    {
                        if($condition!=null)
                        {
                            $total_result=DB::select($query."$condition"." $group");
                            $result_total=DB::select($query."$condition"." "."$search"." "."$group"." "."  $short"." ");
                            $result_total_search=DB::select($query."$search"." "."$group"." ");
                        }
                        else
                        {
                            $total_result=DB::select($query."$group");
                            $result_total=DB::select($query."$search"." "."$group"." "."  $short"." ");
                            $result_total_search=DB::select($query."$search"." "."$group"." ");
                        }

                    }

                }
                else
                {
                    if($condition!=null)
                    {
                        $total_result=DB::select($query."$condition"." $group");

                        $result_total=DB::select($query."$condition"." "."$search"." "."$group"." "." $short"." "."$result_page");

                        $result_total_search=DB::select($query."$condition"." "."$search"." "."$group"." "." $short"."");
                    }
                    else
                    {
                        $total_result=DB::select($query."$group");

                        $result_total=DB::select($query."$search"." "."$group"." "."  $short"." "." $result_page");
                        $result_total_search=DB::select($query."$search"." "."$group"." "."  $short"." ");
                    }
                }

                DB::commit();
                return response()->json(
                    [
                        'status'                => 200,
                        'total'                 => count($total_result),
                        'page'                  => $show==null ? 1: ($show=='all'? 1 : $page),
                        'last_page'             => $show==null ? 1: ($show=='all'? 1 : ceil(count($total_result) / $show)),
                        'showing_start'         => $offset+1,
                        'showing_end'           => count($result_total) >=10 ? $offset+$show  : $offset+count($result_total) ,
                        'result_total_search'   => $search != null  ? ( $show == null ? 1 : ( $show == 'all'  ? 1 : ceil(count($result_total_search) / $show) ) ) : 0,
                        'last_page_search'      => "",
                        'result'                => $result_total
                    ]
                );
            }
            catch(Exception $e)
            {

                DB::rollback();
                return response()->json(
                                        [
                                            'status' => 500,
                                            'result'=> $e->getMessage()
                                        ]);
            }

        }
        else
        {
            return response()->json(
                                    [
                                        'status' => 400,
                                        'result'=> "No Data"
                                    ]);
        }

    }
    public  static function pagination($query,$show,$condition,$group,$short,$page,$search)
    {
        if(isset($query))
        {
            DB::beginTransaction();
            try
            {
                $total_result = [];
                $result_total = [];
                $result_total_search = [];

                if($show=='all' || $show=='All' || $show=='')
                {
                    if($search==null)
                    {

                        if($condition!=null)
                        {



                            $total_result=DB::select($query."$condition"." $group");
                            $result_total=DB::select($query."$condition"." "."$group"." "."  $short"." " );
                            $result_total_search=DB::select($query."$condition"." "."$group"." "."  $short"." ");
                        }
                        else
                        {

                            $total_result=DB::select($query."$group");
                            $result_total=DB::select($query."$group"." "."  $short"." ");
                            $result_total_search=DB::select($query."$group"." "."  $short"." ");

                        }

                    }
                    else
                    {


                        if($condition!=null)
                        {
                            $total_result=DB::select($query."$condition"." $group");
                            $result_total=DB::select($query."$condition"." "."$search"." "."$group"." "."  $short"." ");
                            $result_total_search=DB::select($query."$search"." "."$group"." ");
                        }
                        else
                        {
                            $total_result=DB::select($query."$group");
                            $result_total=DB::select($query."$search"." "."$group"." "."  $short"." ");
                            $result_total_search=DB::select($query."$search"." "."$group"." ");
                        }

                    }

                }
                else
                {
                    // dd("sefrd");
                    $offset=($page - 1) * $show;
                    $result_page='';
                    $result_page="limit $show offset $offset";

                    if($condition!=null)
                    {
                        $total_result=DB::select($query."$condition"." $group");

                        $result_total=DB::select($query."$condition"." "."$search"." "."$group"." "." $short"." "."$result_page");

                        $result_total_search=DB::select($query."$condition"." "."$search"." "."$group"." "." $short"."");
                    }
                    else
                    {
                        $total_result=DB::select($query."$group");

                        $result_total=DB::select($query."$search"." "."$group"." "."  $short"." "." $result_page");
                        $result_total_search=DB::select($query."$search"." "."$group"." "."  $short"." ");
                    }
                }

                DB::commit();
                return response()->json(
                                        [
                                            'status' => 200,
                                            'total' => count($result_total_search),
                                            'result'=> $result_total
                                        ]);
            }
            catch(Exception $e)
            {

                DB::rollback();
                return response()->json(
                                        [
                                            'status' => 500,
                                            'result'=> $e->getMessage()
                                        ]);
            }

        }
        else
        {
            return response()->json(
                                    [
                                        'status' => 400,
                                        'result'=> "No Data"
                                    ]);
        }

    }
    public  static function showPageConnectionERP($query,$show,$condition,$group,$short,$page,$search)
    {
        if(isset($query))
        {
            DB::beginTransaction();
            try
            {

                $offset=($page - 1) * $show;
                $result_page='';
                $result_page="limit $show offset $offset";


                $total_result = [];
                $result_total = [];
                $result_total_search = [];

                if($page==null  && $show==null)
                {
                    if($search==null)
                    {
                        if($condition!=null)
                        {
                            $total_result=DB::connection('report')->select($query."$condition"." $group");
                            $result_total=DB::connection('report')->select($query."$condition"." "."$group"." "."  $short"." ");
                            $result_total_search=DB::connection('report')->select($query."$group"." "."  $short"." ");
                        }
                        else
                        {
                            $total_result=DB::connection('report')->select($query."$group");
                            $result_total=DB::connection('report')->select($query."$group"." "."  $short"." ");
                            $result_total_search=DB::connection('report')->select($query."$group"." "."  $short"." ");
                            // dd('iiiiiiiiiiiiiii',$total_result);

                        }

                    }
                    else
                    {
                        if($condition!=null)
                        {
                            $total_result=DB::connection('report')->select($query."$condition"." $group");
                            $result_total=DB::connection('report')->select($query."$condition"." "."$search"." "."$group"." "."  $short"." ");
                            $result_total_search=DB::connection('report')->select($query."$search"." "."$group"." ");
                        }
                        else
                        {
                            $total_result=DB::connection('report')->select($query."$group");
                            $result_total=DB::connection('report')->select($query."$search"." "."$group"." "."  $short"." ");
                            $result_total_search=DB::connection('report')->select($query."$search"." "."$group"." ");
                        }

                    }

                }
                else
                {
                    if($condition!=null)
                    {
                        $total_result=DB::connection('report')->select($query."$condition"." $group");

                        $result_total=DB::connection('report')->select($query."$condition"." "."$search"." "."$group"." "." $short"." "."$result_page");

                        $result_total_search=DB::connection('report')->select($query."$condition"." "."$search"." "."$group"." "." $short"."");
                    }
                    else
                    {
                        $total_result=DB::connection('report')->select($query."$group");

                        $result_total=DB::connection('report')->select($query."$search"." "."$group"." "."  $short"." "." $result_page");
                        $result_total_search=DB::connection('report')->select($query."$search"." "."$group"." "."  $short"." ");
                    }
                }

                DB::commit();
                return response()->json(
                    [
                        'status'                => 200,
                        'total'                 => count($total_result),
                        'page'                  => $show==null ? 1: ($show=='all'? 1 : $page),
                        'last_page'             => $show==null ? 1: ($show=='all'? 1 : ceil(count($total_result) / $show)),
                        'showing_start'         => $offset+1,
                        'showing_end'           => count($result_total) >=10 ? $offset+$show  : $offset+count($result_total) ,
                        'result_total_search'   => $search !=null ? count($result_total_search):0,
                        'last_page_search'      => $search != null  ? ( $show == null ? 1 : ( $show == 'all'  ? 1 : ceil(count($result_total_search) / $show) ) ) : 0,
                        'result'                => $result_total
                    ]
                );
            }
            catch(Exception $e)
            {

                DB::rollback();
                return response()->json(
                                        [
                                            'status' => 500,
                                            'result'=> $e->getMessage()
                                        ]);
            }

        }
        else
        {
            return response()->json(
                                    [
                                        'status' => 400,
                                        'result'=> "No Data"
                                    ]);
        }

    }
    public  static function showPageConnectionWeb($query,$show,$condition,$group,$short,$page,$search)
    {
        if(isset($query))
        {
            DB::beginTransaction();
            try
            {

                $offset=($page - 1) * $show;
                $result_page='';
                $result_page="limit $show offset $offset";


                $total_result = [];
                $result_total = [];
                $result_total_search = [];

                if($page==null  && $show==null)
                {
                    if($search==null)
                    {
                        if($condition!=null)
                        {
                            $total_result=DB::connection('website')->select($query."$condition"." $group");
                            $result_total=DB::connection('website')->select($query."$condition"." "."$group"." "."  $short"." ");
                            $result_total_search=DB::connection('website')->select($query."$group"." "."  $short"." ");
                        }
                        else
                        {
                            $total_result=DB::connection('website')->select($query."$group");
                            $result_total=DB::connection('website')->select($query."$group"." "."  $short"." ");
                            $result_total_search=DB::connection('website')->select($query."$group"." "."  $short"." ");
                            // dd('iiiiiiiiiiiiiii',$total_result);

                        }

                    }
                    else
                    {
                        if($condition!=null)
                        {
                            $total_result=DB::connection('website')->select($query."$condition"." $group");
                            $result_total=DB::connection('website')->select($query."$condition"." "."$search"." "."$group"." "."  $short"." ");
                            $result_total_search=DB::connection('website')->select($query."$search"." "."$group"." ");
                        }
                        else
                        {
                            $total_result=DB::connection('website')->select($query."$group");
                            $result_total=DB::connection('website')->select($query."$search"." "."$group"." "."  $short"." ");
                            $result_total_search=DB::connection('website')->select($query."$search"." "."$group"." ");
                        }

                    }

                }
                else
                {
                    if($condition!=null)
                    {
                        $total_result=DB::connection('website')->select($query."$condition"." $group");

                        $result_total=DB::connection('website')->select($query."$condition"." "."$search"." "."$group"." "." $short"." "."$result_page");

                        $result_total_search=DB::connection('website')->select($query."$condition"." "."$search"." "."$group"." "." $short"."");
                    }
                    else
                    {
                        $total_result=DB::connection('website')->select($query."$group");

                        $result_total=DB::connection('website')->select($query."$search"." "."$group"." "."  $short"." "." $result_page");
                        $result_total_search=DB::connection('website')->select($query."$search"." "."$group"." "."  $short"." ");
                    }
                }

                DB::commit();
                return response()->json(
                                        [
                                            'status' => 200,
                                            'total' => count($total_result),
                                            'page' => $show==null ? 1: ($show=='all'? 1 : $page),
                                            'last_page' => $show==null ? 1: ($show=='all'? 1 : ceil(count($total_result) / $show)),
                                            'showing_start'=>  $offset+1,
                                            'showing_end'=>  count($result_total) >=10 ? $offset+$show  : $offset+count($result_total) ,
                                            'result_total_search' =>$search!=null? count($result_total_search):0,
                                            'last_page_search' =>$search != null  ? ( $show == null ? 1 : ( $show == 'all'  ? 1 : ceil(count($result_total_search) / $show) ) ) : 0,
                                            'result'=> $result_total
                                        ]);
            }
            catch(Exception $e)
            {

                DB::rollback();
                return response()->json(
                                        [
                                            'status' => 500,
                                            'result'=> $e->getMessage()
                                        ]);
            }

        }
        else
        {
            return response()->json(
                                    [
                                        'status' => 400,
                                        'result'=> "No Data"
                                    ]);
        }

    }

    public  static function showPageMore($query,$show,$condition,$group,$short,$page,$search,$other)
    {
        if(isset($query))
        {
            DB::beginTransaction();
            try
            {

                $offset=($page - 1) * $show;
                $result_page='';
                $result_page="limit $show offset $offset";


                $total_result = [];
                $result_total = [];
                $result_total_search = [];

                if($page==null  && $show==null)
                {
                    if($search==null)
                    {
                        if($condition!=null)
                        {
                            $total_result=DB::select($query."$condition"." $group");
                            $result_total=DB::select($query."$condition"." "."$group"." "."  $short"." ");
                            $result_total_search=DB::select($query."$group"." "."  $short"." ");
                        }
                        else
                        {
                            $total_result=DB::select($query."$group");
                            $result_total=DB::select($query."$group"." "."  $short"." ");
                            $result_total_search=DB::select($query."$group"." "."  $short"." ");
                            // dd('iiiiiiiiiiiiiii',$total_result);

                        }

                    }
                    else
                    {
                        if($condition!=null)
                        {
                            $total_result=DB::select($query."$condition"." $group");
                            $result_total=DB::select($query."$condition"." "."$search"." "."$group"." "."  $short"." ");
                            $result_total_search=DB::select($query."$search"." "."$group"." ");
                        }
                        else
                        {
                            $total_result=DB::select($query."$group");
                            $result_total=DB::select($query."$search"." "."$group"." "."  $short"." ");
                            $result_total_search=DB::select($query."$search"." "."$group"." ");
                        }

                    }

                }
                else
                {
                    if($condition!=null)
                    {
                        $total_result=DB::select($query."$condition"." $group");

                        $result_total=DB::select($query."$condition"." "."$search"." "."$group"." "." $short"." "."$result_page");

                        $result_total_search=DB::select($query."$condition"." "."$search"." "."$group"." "." $short"."");
                    }
                    else
                    {
                        $total_result=DB::select($query."$group");

                        $result_total=DB::select($query."$search"." "."$group"." "."  $short"." "." $result_page");
                        $result_total_search=DB::select($query."$search"." "."$group"." "."  $short"." ");
                    }
                }

                DB::commit();
                return response()->json(
                                        [
                                            'status' => 200,
                                            'total' => count($total_result),
                                            'page' => $show==null ? 1: ($show=='all'? 1 : $page),
                                            'last_page' => $show==null ? 1: ($show=='all'? 1 : ceil(count($total_result) / $show)),
                                            'showing_start'=>  $offset+1,
                                            'showing_end'=>  count($result_total) >=10 ? $offset+$show  : $offset+count($result_total) ,
                                            'result_total_search' =>$search!=null? count($result_total_search):0,
                                            'last_page_search' =>$search != null  ? ( $show == null ? 1 : ( $show == 'all'  ? 1 : ceil(count($result_total_search) / $show) ) ) : 0,
                                            'other'=>$other,
                                            'result'=> $result_total
                                        ]);
            }
            catch(Exception $e)
            {

                DB::rollback();
                return response()->json(
                                        [
                                            'status' => 500,
                                            'result'=> $e->getMessage()
                                        ]);
            }

        }
        else
        {
            return response()->json(
                                    [
                                        'status' => 400,
                                        'result'=> "No Data"
                                    ]);
        }

    }





// call pagination
    public static function indexDataPagination($show,$search,$page,$list,$searchBy,$shortBy)
    {
        DB::beginTransaction();
        try
        {
            $condition=null;

             // short
            $short=$shortBy;
            if($short != null){
                $short_=$short;
            }
            else{
                $short_='';
            }

            if($page !='' && $show !='')
            {
                $condition=null;
                // search
                $search_='';


                if($search !=null){
                    $search_= $searchBy;
                }
                else{
                    $search_='';
                }

                //group
                $group=null;
                $query=$list;
                DB::commit();
                return paginationModel::showPage($query,$show,$condition,$group,$short_,$page,$search_);
            }
            else
            {
                $query=$list .' '. $condition .' '. $short_;
                return responseController::success(DB::select($query));
            }
        }
        catch(Exception $e)
        {

            DB::rollback();
            return response()->json(
                                    [
                                        'status' => 500,
                                        'result'=> $e->getMessage()
                                    ]);
        }
    }


// page with difference database
public  static function connectionWebPagination($query,$show,$condition,$group,$short,$page,$search)
    {
        if(isset($query))
        {
            DB::beginTransaction();
            try
            {

                $offset=($page - 1) * $show;
                $result_page='';
                $result_page="limit $show offset $offset";


                $total_result = [];
                $result_total = [];
                $result_total_search = [];

                if($page==null  && $show==null)
                {
                    if($search==null)
                    {
                        if($condition!=null)
                        {
                            $total_result=DB::connection('website')->select($query."$condition"." $group");
                            $result_total=DB::connection('website')->select($query."$condition"." "."$group"." "."  $short"." ");
                            $result_total_search=DB::connection('website')->select($query."$group"." "."  $short"." ");
                        }
                        else
                        {
                            $total_result=DB::connection('website')->select($query."$group");
                            $result_total=DB::connection('website')->select($query."$group"." "."  $short"." ");
                            $result_total_search=DB::connection('website')->select($query."$group"." "."  $short"." ");
                            // dd('iiiiiiiiiiiiiii',$total_result);

                        }

                    }
                    else
                    {
                        if($condition!=null)
                        {
                            $total_result=DB::connection('website')->select($query."$condition"." $group");
                            $result_total=DB::connection('website')->select($query."$condition"." "."$search"." "."$group"." "."  $short"." ");
                            $result_total_search=DB::connection('website')->select($query."$search"." "."$group"." ");
                        }
                        else
                        {
                            $total_result=DB::connection('website')->select($query."$group");
                            $result_total=DB::connection('website')->select($query."$search"." "."$group"." "."  $short"." ");
                            $result_total_search=DB::connection('website')->select($query."$search"." "."$group"." ");
                        }

                    }

                }
                else
                {
                    if($condition!=null)
                    {
                        $total_result=DB::connection('website')->select($query."$condition"." $group");

                        $result_total=DB::connection('website')->select($query."$condition"." "."$search"." "."$group"." "." $short"." "."$result_page");

                        $result_total_search=DB::connection('website')->select($query."$condition"." "."$search"." "."$group"." "." $short"."");
                    }
                    else
                    {
                        $total_result=DB::connection('website')->select($query."$group");

                        $result_total=DB::connection('website')->select($query."$search"." "."$group"." "."  $short"." "." $result_page");
                        $result_total_search=DB::connection('website')->select($query."$search"." "."$group"." "."  $short"." ");
                    }
                }

                DB::commit();
                return response()->json(
                                        [
                                            'status' => 200,
                                            'total' => count($total_result),
                                            'page' => $show==null ? 1: ($show=='all'? 1 : $page),
                                            'last_page' => $show==null ? 1: ($show=='all'? 1 : ceil(count($total_result) / $show)),
                                            'showing_start'=>  $offset+1,
                                            'showing_end'=>  count($result_total) >=10 ? $offset+$show  : $offset+count($result_total) ,
                                            'result_total_search' =>$search!=null? count($result_total_search):0,
                                            'last_page_search' =>$search != null  ? ( $show == null ? 1 : ( $show == 'all'  ? 1 : ceil(count($result_total_search) / $show) ) ) : 0,
                                            'result'=> $result_total
                                        ]);
            }
            catch(Exception $e)
            {

                DB::rollback();
                return response()->json(
                                        [
                                            'status' => 500,
                                            'result'=> $e->getMessage()
                                        ]);
            }

        }
        else
        {
            return response()->json(
                                    [
                                        'status' => 400,
                                        'result'=> "No Data"
                                    ]);
        }

    }


    // call pagination
    public static function indexDataPaginationCon($show,$search,$page,$list,$searchBy,$shortBy)
    {
        DB::beginTransaction();
        try
        {
            if($page !='' && $show !='')
            {
                $condition=null;
                // search
                $search_='';


                if($search !=null){
                    $search_= $searchBy;
                }
                else{
                    $search_='';
                }


                // short
                $short=$shortBy;
                if($short != null){
                    $short_=$short;
                }
                else{
                    $short_='';
                }


                //group
                $group=null;
                $query=$list;
                DB::commit();
                return paginationModel::connectionWebPagination($query,$show,$condition,$group,$short,$page,$search_);
            }
            else
            {
                return responseController::success(DB::connection('website')->select($list));
            }
        }
        catch(Exception $e)
        {

            DB::rollback();
            return response()->json(
                                    [
                                        'status' => 500,
                                        'result'=> $e->getMessage()
                                    ]);
        }
    }


    public  static function paginationReport($query,$show,$condition,$group,$short,$page,$search)
    {
        if(isset($query))
        {
            DB::beginTransaction();
            try
            {
                $total_result = [];
                $result_total = [];
                $result_total_search = [];

                if($show=='all' || $show=='All' || $show=='')
                {
                    if($search==null)
                    {

                        if($condition!=null)
                        {
                            $total_result=DB::connection('report')->select($query."$condition"." $group");
                            $result_total=DB::connection('report')->select($query."$condition"." "."$group"." "."  $short"." " );
                            $result_total_search=DB::connection('report')->select($query."$condition"." "."$group"." "."  $short"." ");
                        }
                        else
                        {

                            $total_result=DB::connection('report')->select($query."$group");
                            $result_total=DB::connection('report')->select($query."$group"." "."  $short"." ");
                            $result_total_search=DB::connection('report')->select($query."$group"." "."  $short"." ");

                        }
                    }
                    else
                    {
                        if($condition!=null)
                        {
                            $total_result=DB::connection('report')->select($query."$condition"." $group");
                            $result_total=DB::connection('report')->select($query."$condition"." "."$search"." "."$group"." "."  $short"." ");
                            $result_total_search=DB::connection('report')->select($query."$search"." "."$group"." ");
                        }
                        else
                        {
                            $total_result=DB::connection('report')->select($query."$group");
                            $result_total=DB::connection('report')->select($query."$search"." "."$group"." "."  $short"." ");
                            $result_total_search=DB::connection('report')->select($query."$search"." "."$group"." ");
                        }

                    }

                }
                else
                {
                    $offset=($page - 1) * $show;
                    $result_page='';
                    $result_page="limit $show offset $offset";

                    if($condition!=null)
                    {
                        $total_result=DB::connection('report')->select($query."$condition"." $group");

                        $result_total=DB::connection('report')->select($query."$condition"." "."$search"." "."$group"." "." $short"." "."$result_page");

                        $result_total_search=DB::connection('report')->select($query."$condition"." "."$search"." "."$group"." "." $short"."");
                    }
                    else
                    {
                        $total_result=DB::connection('report')->select($query."$group");

                        $result_total=DB::connection('report')->select($query."$search"." "."$group"." "."  $short"." "." $result_page");
                        $result_total_search=DB::connection('report')->select($query."$search"." "."$group"." "."  $short"." ");
                    }
                }

                DB::commit();
                return response()->json(
                                        [
                                            'status' => 200,
                                            'total' => count($result_total_search),
                                            'result'=> $result_total
                                        ]);
            }
            catch(Exception $e)
            {

                DB::rollback();
                return response()->json(
                                        [
                                            'status' => 500,
                                            'result'=> $e->getMessage()
                                        ]);
            }

        }
        else
        {
            return response()->json(
                                    [
                                        'status' => 400,
                                        'result'=> "No Data"
                                    ]);
        }

    }
    public  static function connectionRadius($query,$show,$condition,$group,$short,$page,$search)
    {
        if(isset($query))
        {
            DB::beginTransaction();
            try
            {
                $total_result = [];
                $result_total = [];
                $result_total_search = [];

                if($show=='all' || $show=='All' || $show=='')
                {
                    if($search==null)
                    {

                        if($condition!=null)
                        {
                            $total_result=DB::connection('radius')->select($query."$condition"." $group");
                            $result_total=DB::connection('radius')->select($query."$condition"." "."$group"." "."  $short"." " );
                            $result_total_search=DB::connection('radius')->select($query."$condition"." "."$group"." "."  $short"." ");
                        }
                        else
                        {

                            $total_result=DB::connection('radius')->select($query."$group");
                            $result_total=DB::connection('radius')->select($query."$group"." "."  $short"." ");
                            $result_total_search=DB::connection('radius')->select($query."$group"." "."  $short"." ");

                        }
                    }
                    else
                    {
                        if($condition!=null)
                        {
                            $total_result=DB::connection('radius')->select($query."$condition"." $group");
                            $result_total=DB::connection('radius')->select($query."$condition"." "."$search"." "."$group"." "."  $short"." ");
                            $result_total_search=DB::connection('radius')->select($query."$search"." "."$group"." ");
                        }
                        else
                        {
                            $total_result=DB::connection('radius')->select($query."$group");
                            $result_total=DB::connection('radius')->select($query."$search"." "."$group"." "."  $short"." ");
                            $result_total_search=DB::connection('radius')->select($query."$search"." "."$group"." ");
                        }

                    }

                }
                else
                {
                    $offset=($page - 1) * $show;
                    $result_page='';
                    $result_page="limit $show offset $offset";

                    if($condition!=null)
                    {
                        $total_result=DB::connection('radius')->select($query."$condition"." $group");

                        $result_total=DB::connection('radius')->select($query."$condition"." "."$search"." "."$group"." "." $short"." "."$result_page");

                        $result_total_search=DB::connection('radius')->select($query."$condition"." "."$search"." "."$group"." "." $short"."");
                    }
                    else
                    {
                        $total_result=DB::connection('radius')->select($query."$group");

                        $result_total=DB::connection('radius')->select($query."$search"." "."$group"." "."  $short"." "." $result_page");
                        $result_total_search=DB::connection('radius')->select($query."$search"." "."$group"." "."  $short"." ");
                    }
                }

                DB::commit();
                return response()->json(
                                        [
                                            'status' => 200,
                                            'total' => count($result_total_search),
                                            'result'=> $result_total
                                        ]);
            }
            catch(Exception $e)
            {

                DB::rollback();
                return response()->json(
                                        [
                                            'status' => 500,
                                            'result'=> $e->getMessage()
                                        ]);
            }

        }
        else
        {
            return response()->json(
                                    [
                                        'status' => 400,
                                        'result'=> "No Data"
                                    ]);
        }

    }
}
