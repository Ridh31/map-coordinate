<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="icon" href="{{ asset('images/map-coordinate.png') }}" type="image/x-icon"/>

    <title>Map Coordinate</title>

    {{-- Header --}}
    @include('layouts.header')

    @yield('style')
    
</head>

<body>
    <header class="w-full h-[6vh] whitespace-nowrap">
        <nav class="bg-gray-800 border-gray-200 px-4 lg:px-6 py-2.5">
            <div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">

                {{-- Logo & title --}}
                <a href="/" class="flex items-center">
                    <img src="{{ asset('images/map-coordinate.png') }}" class="mr-3 h-6 sm:h-9" alt="Map Coordinate"/>
                </a>

                {{-- Header Items --}}
                <div class="flex items-center lg:order-2">

                    {{-- Login & Get started --}}
                    <a href="https://www.openstreetmap.org/" target="_blank" class="text-white hover:text-[#EDC42E] focus:ring-0 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none dark:focus:ring-0">OSM</a>
                    <a href="https://overpass-api.de/" target="_blank" class="text-white bg-[#EDC42E] focus:ring-0 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-[#EDC42E] focus:outline-none dark:focus:ring-0">Overpass API</a>
                </div>
            </div>
        </nav>
    </header>

    {{-- Content --}}
    <section class="w-full h-full z-40">
        <div class="relative">@yield('content')</div>
    </section>

    {{-- Footer --}}
    <footer class="flex flex-col justify-center items-center w-full h-[6vh] bg-gray-800 select-none whitespace-nowrap">
        <div id="display-date" class="text-sm text-center text-white"></div>
        <div id="digital-clock" class="text-center text-[#EDC42E]" style="font-family: digital, sans-serif;"></div>
    </footer>

    @include('layouts.footer')
</body>

</html>