<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kode Verifikasi OTP</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>

<body class="bg-gray-100 flex justify-center items-center min-h-screen">
    <div class="bg-white p-6 rounded-lg shadow-md w-96 text-center">
        <h1 class="text-2xl font-bold text-gray-800 mb-4">Kode Verifikasi (OTP) Digitefa Kamu</h1>
        <div class="flex justify-center space-x-2 mb-4">
            @foreach (str_split($code) as $digit)
                <span
                    class="w-12 h-12 bg-gray-100 border border-gray-300 rounded-lg flex justify-center items-center text-2xl font-bold">{{ $digit }}</span>
            @endforeach
        </div>
        <p class="text-sm text-gray-600 mb-2">Berlaku selama 5 menit.</p>
        <p class="text-sm text-red-500 font-semibold mb-4">JANGAN BERI kode ini ke siapa pun, TERMASUK DIGITEFA.</p>
        <a href="#" class="text-blue-500 hover:underline text-sm">Ayo, daftar di Digitefa!</a>
    </div>
</body>

</html>
