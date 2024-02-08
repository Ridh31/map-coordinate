@extends('master')
@section('content')

<style>

    #map {
        width: 100%;
        min-height: 88vh;
    }

</style>

<div id="map"></div>
<div data-initial-markers=<?php echo json_encode($initialMarkers); ?>></div>

{{-- Map --}}
<script src="{{ asset('js/map.js') }}"></script>

@endsection