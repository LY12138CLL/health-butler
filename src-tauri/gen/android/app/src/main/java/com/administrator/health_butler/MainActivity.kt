package com.administrator.health_butler

import android.os.Bundle
// import androidx.activity.enableEdgeToEdge

import android.view.WindowManager



class MainActivity : TauriActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    // enableEdgeToEdge()
    window.setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE)
    super.onCreate(savedInstanceState)
  }
}
