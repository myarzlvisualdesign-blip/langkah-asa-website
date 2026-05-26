<?php
declare(strict_types=1);

session_name('LANGKAH_ASA_CMS');
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'secure' => (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'),
    'httponly' => true,
    'samesite' => 'Strict',
]);
session_start();

$adminPasswordHash = '$2y$12$Aq2rY52YCHxzpxW5tWjHUOTd8sB6vNZkQpZ8psL11toLGcO/E93Iq';
$contentFile = __DIR__ . '/content.json';
$backupDir = __DIR__ . '/backups';
$uploadDir = __DIR__ . '/uploads';
$analyticsFile = __DIR__ . '/analytics.json';

function json_response(array $payload, int $status = 200): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-cache, no-store, must-revalidate');
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function require_auth(): void
{
    if (empty($_SESSION['authenticated'])) {
        json_response(['ok' => false, 'error' => 'Sesi admin tidak aktif. Silakan login ulang.'], 401);
    }
}

function read_json_body(): array
{
    $raw = file_get_contents('php://input') ?: '';
    $data = json_decode($raw, true);

    if (!is_array($data)) {
        json_response(['ok' => false, 'error' => 'Format JSON tidak valid.'], 400);
    }

    return $data;
}

function read_content(string $contentFile): array
{
    if (!file_exists($contentFile)) {
        return [];
    }

    $raw = file_get_contents($contentFile);
    $data = json_decode($raw ?: '{}', true);

    return is_array($data) ? $data : [];
}

function safe_filename(string $name): string
{
    $name = strtolower($name);
    $name = preg_replace('/[^a-z0-9._-]+/', '-', $name) ?: 'upload';
    $name = trim($name, '-.');

    return $name !== '' ? $name : 'upload';
}

function client_ip_hash(): string
{
    $ip = $_SERVER['HTTP_CF_CONNECTING_IP']
        ?? $_SERVER['HTTP_X_FORWARDED_FOR']
        ?? $_SERVER['REMOTE_ADDR']
        ?? 'unknown';
    $ip = explode(',', (string)$ip)[0];

    return hash('sha256', trim($ip));
}

function read_analytics(string $analyticsFile): array
{
    if (!file_exists($analyticsFile)) {
        return ['days' => [], 'recent' => []];
    }

    $raw = file_get_contents($analyticsFile);
    $data = json_decode($raw ?: '{}', true);

    if (!is_array($data)) {
        return ['days' => [], 'recent' => []];
    }

    return [
        'days' => is_array($data['days'] ?? null) ? $data['days'] : [],
        'recent' => is_array($data['recent'] ?? null) ? $data['recent'] : [],
    ];
}

function write_analytics(string $analyticsFile, array $data): bool
{
    $encoded = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

    return $encoded !== false && file_put_contents($analyticsFile, $encoded . PHP_EOL, LOCK_EX) !== false;
}

function sanitize_path(string $path): string
{
    $path = parse_url($path, PHP_URL_PATH) ?: '/';
    $path = '/' . ltrim((string)$path, '/');

    if (strlen($path) > 140) {
        $path = substr($path, 0, 140);
    }

    return preg_replace('/[^a-zA-Z0-9_\\-\\/\\.]/', '', $path) ?: '/';
}

$action = $_GET['action'] ?? '';

if ($action === 'status') {
    json_response(['ok' => true, 'authenticated' => !empty($_SESSION['authenticated'])]);
}

if ($action === 'track') {
    $data = read_json_body();
    $path = sanitize_path((string)($data['path'] ?? '/'));
    $today = date('Y-m-d');
    $now = time();
    $visitorKey = client_ip_hash();
    $analytics = read_analytics($analyticsFile);

    if (!isset($analytics['days'][$today]) || !is_array($analytics['days'][$today])) {
        $analytics['days'][$today] = ['views' => 0, 'visitors' => [], 'pages' => []];
    }

    $analytics['days'][$today]['views'] = (int)($analytics['days'][$today]['views'] ?? 0) + 1;
    $analytics['days'][$today]['visitors'][$visitorKey] = $now;
    $analytics['days'][$today]['pages'][$path] = (int)($analytics['days'][$today]['pages'][$path] ?? 0) + 1;
    $analytics['recent'][$visitorKey] = ['lastSeen' => $now, 'path' => $path];

    $cutoffDay = date('Y-m-d', strtotime('-30 days'));
    foreach ($analytics['days'] as $day => $_value) {
        if ($day < $cutoffDay) {
            unset($analytics['days'][$day]);
        }
    }

    foreach ($analytics['recent'] as $key => $value) {
        if ((int)($value['lastSeen'] ?? 0) < $now - 900) {
            unset($analytics['recent'][$key]);
        }
    }

    write_analytics($analyticsFile, $analytics);
    json_response(['ok' => true]);
}

if ($action === 'analytics') {
    require_auth();
    $analytics = read_analytics($analyticsFile);
    $today = date('Y-m-d');
    $now = time();
    $todayData = is_array($analytics['days'][$today] ?? null) ? $analytics['days'][$today] : ['views' => 0, 'visitors' => [], 'pages' => []];
    $online = 0;

    foreach ($analytics['recent'] as $value) {
        if ((int)($value['lastSeen'] ?? 0) >= $now - 300) {
            $online++;
        }
    }

    $last7Views = 0;
    $last7Visitors = [];
    $daily = [];

    for ($offset = 6; $offset >= 0; $offset--) {
        $day = date('Y-m-d', strtotime("-{$offset} days"));
        $dayData = is_array($analytics['days'][$day] ?? null) ? $analytics['days'][$day] : ['views' => 0, 'visitors' => []];
        $views = (int)($dayData['views'] ?? 0);
        $visitors = is_array($dayData['visitors'] ?? null) ? $dayData['visitors'] : [];
        $last7Views += $views;
        $last7Visitors += $visitors;
        $daily[] = ['date' => $day, 'views' => $views, 'visitors' => count($visitors)];
    }

    $pages = is_array($todayData['pages'] ?? null) ? $todayData['pages'] : [];
    arsort($pages);
    $topPages = [];
    foreach (array_slice($pages, 0, 8, true) as $path => $views) {
        $topPages[] = ['path' => $path, 'views' => (int)$views];
    }

    json_response([
        'ok' => true,
        'analytics' => [
            'today' => [
                'date' => $today,
                'views' => (int)($todayData['views'] ?? 0),
                'visitors' => count(is_array($todayData['visitors'] ?? null) ? $todayData['visitors'] : []),
            ],
            'onlineNow' => $online,
            'last7Days' => [
                'views' => $last7Views,
                'visitors' => count($last7Visitors),
                'daily' => $daily,
            ],
            'topPagesToday' => $topPages,
            'serverTime' => date('c', $now),
        ],
    ]);
}

if ($action === 'login') {
    $data = read_json_body();
    $password = (string)($data['password'] ?? '');

    if (!password_verify($password, $adminPasswordHash)) {
        json_response(['ok' => false, 'error' => 'Password admin salah.'], 401);
    }

    session_regenerate_id(true);
    $_SESSION['authenticated'] = true;
    json_response(['ok' => true]);
}

if ($action === 'logout') {
    $_SESSION = [];
    session_destroy();
    json_response(['ok' => true]);
}

if ($action === 'get') {
    require_auth();
    json_response(['ok' => true, 'content' => read_content($contentFile)]);
}

if ($action === 'save') {
    require_auth();
    $data = read_json_body();

    if (!isset($data['site'], $data['contact'], $data['heroSlides'], $data['products'])) {
        json_response(['ok' => false, 'error' => 'Data CMS tidak lengkap.'], 400);
    }

    if (!is_dir($backupDir) && !mkdir($backupDir, 0755, true)) {
        json_response(['ok' => false, 'error' => 'Gagal membuat folder backup.'], 500);
    }

    if (file_exists($contentFile)) {
        $backupName = $backupDir . '/content-' . date('Ymd-His') . '.json.backup';
        @copy($contentFile, $backupName);
    }

    $encoded = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

    if ($encoded === false || file_put_contents($contentFile, $encoded . PHP_EOL, LOCK_EX) === false) {
        json_response(['ok' => false, 'error' => 'Gagal menyimpan content.json.'], 500);
    }

    json_response(['ok' => true]);
}

if ($action === 'upload') {
    require_auth();

    if (empty($_FILES['file']) || !is_array($_FILES['file'])) {
        json_response(['ok' => false, 'error' => 'Tidak ada file yang diupload.'], 400);
    }

    $file = $_FILES['file'];

    if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        json_response(['ok' => false, 'error' => 'Upload gagal. Kode error: ' . (string)$file['error']], 400);
    }

    if (($file['size'] ?? 0) > 8 * 1024 * 1024) {
        json_response(['ok' => false, 'error' => 'Ukuran gambar maksimal 8MB.'], 400);
    }

    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = $finfo->file((string)$file['tmp_name']);
    $allowed = [
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'image/webp' => 'webp',
        'image/gif' => 'gif',
    ];

    if (!isset($allowed[$mime])) {
        json_response(['ok' => false, 'error' => 'Format gambar harus JPG, PNG, WEBP, atau GIF.'], 400);
    }

    if (!is_dir($uploadDir) && !mkdir($uploadDir, 0755, true)) {
        json_response(['ok' => false, 'error' => 'Gagal membuat folder upload.'], 500);
    }

    $baseName = pathinfo((string)$file['name'], PATHINFO_FILENAME);
    $fileName = date('Ymd-His') . '-' . bin2hex(random_bytes(4)) . '-' . safe_filename($baseName) . '.' . $allowed[$mime];
    $target = $uploadDir . '/' . $fileName;

    if (!move_uploaded_file((string)$file['tmp_name'], $target)) {
        json_response(['ok' => false, 'error' => 'Gagal menyimpan file upload.'], 500);
    }

    chmod($target, 0644);
    json_response(['ok' => true, 'url' => '/cms/uploads/' . $fileName]);
}

json_response(['ok' => false, 'error' => 'Action CMS tidak dikenal.'], 404);
