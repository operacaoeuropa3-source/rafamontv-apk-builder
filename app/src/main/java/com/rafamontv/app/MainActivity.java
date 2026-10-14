package com.rafamontv.app;

import android.app.Activity;
import android.content.Context;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.view.inputmethod.InputMethodManager;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class MainActivity extends Activity {
    private WebView webView;
    private long lastBackPressMs = 0;
    private final ExecutorService httpPool = Executors.newFixedThreadPool(4);
    private final ConcurrentHashMap<String, String> asyncResponses = new ConcurrentHashMap<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        requestWindowFeature(Window.FEATURE_NO_TITLE);
        Window win = getWindow();
        if (win != null) {
            win.setFlags(
                WindowManager.LayoutParams.FLAG_FULLSCREEN | WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON,
                WindowManager.LayoutParams.FLAG_FULLSCREEN | WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON
            );
        }

        webView = new WebView(this);
        webView.setBackgroundColor(Color.parseColor("#040711"));
        webView.setFocusable(true);
        webView.setFocusableInTouchMode(true);

        WebSettings ws = webView.getSettings();
        ws.setJavaScriptEnabled(true);
        ws.setDomStorageEnabled(true);
        ws.setDatabaseEnabled(true);
        ws.setAllowFileAccess(true);
        ws.setAllowContentAccess(true);
        ws.setAllowFileAccessFromFileURLs(true);
        ws.setAllowUniversalAccessFromFileURLs(true);
        ws.setMediaPlaybackRequiresUserGesture(false);
        ws.setLoadWithOverviewMode(true);
        ws.setUseWideViewPort(true);
        ws.setCacheMode(WebSettings.LOAD_DEFAULT);
        ws.setUserAgentString("RafamonTV/2.2 (Android TV; TCL Smart TV) VLC/3.0.20 LibVLC/3.0.20");

        if (Build.VERSION.SDK_INT >= 21) {
            ws.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        }

        webView.addJavascriptInterface(new AndroidBridge(), "AndroidBridge");
        webView.setWebViewClient(new WebViewClient());
        webView.setWebChromeClient(new WebChromeClient());

        setContentView(webView);
        hideSystemUI();

        webView.loadUrl("file:///android_asset/www/index.html");
        webView.requestFocus();
    }

    @Override
    public boolean dispatchKeyEvent(KeyEvent event) {
        if (webView != null) {
            int keyCode = event.getKeyCode();
            String dir = null;
            if (keyCode == KeyEvent.KEYCODE_DPAD_UP) dir = "up";
            else if (keyCode == KeyEvent.KEYCODE_DPAD_DOWN) dir = "down";
            else if (keyCode == KeyEvent.KEYCODE_DPAD_LEFT) dir = "left";
            else if (keyCode == KeyEvent.KEYCODE_DPAD_RIGHT) dir = "right";

            if (dir != null) {
                if (event.getAction() == KeyEvent.ACTION_DOWN) {
                    webView.evaluateJavascript(
                        "window.__handleDpadDirection && window.__handleDpadDirection('" + dir + "')",
                        null
                    );
                }
                return true;
            }

            if (keyCode == KeyEvent.KEYCODE_DPAD_CENTER || keyCode == KeyEvent.KEYCODE_ENTER) {
                if (event.getAction() == KeyEvent.ACTION_DOWN && event.getRepeatCount() == 0) {
                    webView.evaluateJavascript(
                        "window.__handleDpadSelect && window.__handleDpadSelect()",
                        null
                    );
                }
                return true;
            }
        }
        return super.dispatchKeyEvent(event);
    }

    private void hideSystemUI() {
        if (Build.VERSION.SDK_INT >= 19 && getWindow() != null) {
            getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_FULLSCREEN
                | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
            );
        }
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) {
            hideSystemUI();
        }
    }

    @Override
    public void onBackPressed() {
        if (webView != null) {
            webView.evaluateJavascript(
                "(window.__handleAndroidBack && window.__handleAndroidBack()) ? 'HANDLED' : 'EXIT'",
                new ValueCallback<String>() {
                    @Override
                    public void onReceiveValue(String value) {
                        if (value != null && value.contains("HANDLED")) {
                            return;
                        }
                        long now = System.currentTimeMillis();
                        if (now - lastBackPressMs < 2200) {
                            MainActivity.super.onBackPressed();
                        } else {
                            lastBackPressMs = now;
                            webView.evaluateJavascript(
                                "if(window.showToast) window.showToast('Pressione Voltar novamente para sair do Rafamon TV');",
                                null
                            );
                        }
                    }
                }
            );
            return;
        }
        super.onBackPressed();
    }

    public class AndroidBridge {
        @JavascriptInterface
        public void showKeyboard() {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    if (webView != null) {
                        webView.requestFocus();
                        InputMethodManager imm = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
                        if (imm != null) {
                            imm.showSoftInput(webView, InputMethodManager.SHOW_IMPLICIT);
                        }
                    }
                }
            });
        }

        @JavascriptInterface
        public void httpGetAsync(final String urlStr, final String cbId) {
            httpPool.execute(new Runnable() {
                @Override
                public void run() {
                    final String res = httpGet(urlStr);
                    asyncResponses.put(cbId, res != null ? res : "__ERROR__:Empty");
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            if (webView != null) {
                                webView.evaluateJavascript(
                                    "window.__onAndroidHttpResult && window.__onAndroidHttpResult('" + cbId + "')",
                                    null
                                );
                            }
                        }
                    });
                }
            });
        }

        @JavascriptInterface
        public String takeHttpResponse(String cbId) {
            String val = asyncResponses.remove(cbId);
            return val != null ? val : "";
        }

        @JavascriptInterface
        public String httpGet(String urlStr) {
            HttpURLConnection conn = null;
            try {
                String currentUrl = urlStr;
                for (int redirects = 0; redirects < 5; redirects++) {
                    URL url = new URL(currentUrl);
                    conn = (HttpURLConnection) url.openConnection();
                    conn.setInstanceFollowRedirects(false);
                    conn.setRequestMethod("GET");
                    conn.setConnectTimeout(25000);
                    conn.setReadTimeout(45000);
                    conn.setRequestProperty("User-Agent", "VLC/3.0.20 LibVLC/3.0.20");
                    conn.setRequestProperty("Accept", "*/*");

                    int status = conn.getResponseCode();
                    if (status == HttpURLConnection.HTTP_MOVED_TEMP
                        || status == HttpURLConnection.HTTP_MOVED_PERM
                        || status == HttpURLConnection.HTTP_SEE_OTHER
                        || status == 307
                        || status == 308) {
                        String loc = conn.getHeaderField("Location");
                        conn.disconnect();
                        if (loc == null || loc.isEmpty()) break;
                        currentUrl = new URL(url, loc).toString();
                        continue;
                    }

                    InputStream is = (status >= 200 && status < 400)
                        ? conn.getInputStream()
                        : conn.getErrorStream();
                    if (is == null) {
                        return "__ERROR__:HTTP " + status;
                    }
                    BufferedReader reader = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8));
                    StringBuilder sb = new StringBuilder();
                    char[] buf = new char[8192];
                    int n;
                    while ((n = reader.read(buf)) != -1) {
                        sb.append(buf, 0, n);
                    }
                    reader.close();
                    if (status >= 400) {
                        return "__ERROR__:HTTP " + status;
                    }
                    return sb.toString();
                }
                return "__ERROR__:Too many redirects";
            } catch (Exception e) {
                return "__ERROR__:" + e.getMessage();
            } finally {
                if (conn != null) {
                    conn.disconnect();
                }
            }
        }
    }
}
