// vite.config.js
import { defineConfig } from "file:///C:/Users/ZION/Documents/CODES/VAULTIFY/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/ZION/Documents/CODES/VAULTIFY/node_modules/@vitejs/plugin-react/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [react()],
  server: {
    port: 3e3,
    open: true,
    host: true
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          crypto: ["crypto-js", "ethers"],
          ui: ["lucide-react", "framer-motion"],
          utils: ["zustand", "react-hot-toast"]
        }
      }
    }
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
  },
  optimizeDeps: {
    include: ["react", "react-dom", "crypto-js", "ethers", "lucide-react"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxaSU9OXFxcXERvY3VtZW50c1xcXFxDT0RFU1xcXFxWQVVMVElGWVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcWklPTlxcXFxEb2N1bWVudHNcXFxcQ09ERVNcXFxcVkFVTFRJRllcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL1pJT04vRG9jdW1lbnRzL0NPREVTL1ZBVUxUSUZZL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbcmVhY3QoKV0sXHJcbiAgc2VydmVyOiB7XHJcbiAgICBwb3J0OiAzMDAwLFxyXG4gICAgb3BlbjogdHJ1ZSxcclxuICAgIGhvc3Q6IHRydWVcclxuICB9LFxyXG4gIGJ1aWxkOiB7XHJcbiAgICBvdXREaXI6ICdkaXN0JyxcclxuICAgIHNvdXJjZW1hcDogZmFsc2UsXHJcbiAgICBtaW5pZnk6ICdlc2J1aWxkJyxcclxuICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgbWFudWFsQ2h1bmtzOiB7XHJcbiAgICAgICAgICB2ZW5kb3I6IFsncmVhY3QnLCAncmVhY3QtZG9tJ10sXHJcbiAgICAgICAgICBjcnlwdG86IFsnY3J5cHRvLWpzJywgJ2V0aGVycyddLFxyXG4gICAgICAgICAgdWk6IFsnbHVjaWRlLXJlYWN0JywgJ2ZyYW1lci1tb3Rpb24nXSxcclxuICAgICAgICAgIHV0aWxzOiBbJ3p1c3RhbmQnLCAncmVhY3QtaG90LXRvYXN0J11cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG4gIGRlZmluZToge1xyXG4gICAgX19BUFBfVkVSU0lPTl9fOiBKU09OLnN0cmluZ2lmeShwcm9jZXNzLmVudi5ucG1fcGFja2FnZV92ZXJzaW9uKVxyXG4gIH0sXHJcbiAgb3B0aW1pemVEZXBzOiB7XHJcbiAgICBpbmNsdWRlOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbScsICdjcnlwdG8tanMnLCAnZXRoZXJzJywgJ2x1Y2lkZS1yZWFjdCddXHJcbiAgfVxyXG59KVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWdULFNBQVMsb0JBQW9CO0FBQzdVLE9BQU8sV0FBVztBQUVsQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsRUFDakIsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxJQUNSLFdBQVc7QUFBQSxJQUNYLFFBQVE7QUFBQSxJQUNSLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQSxRQUNOLGNBQWM7QUFBQSxVQUNaLFFBQVEsQ0FBQyxTQUFTLFdBQVc7QUFBQSxVQUM3QixRQUFRLENBQUMsYUFBYSxRQUFRO0FBQUEsVUFDOUIsSUFBSSxDQUFDLGdCQUFnQixlQUFlO0FBQUEsVUFDcEMsT0FBTyxDQUFDLFdBQVcsaUJBQWlCO0FBQUEsUUFDdEM7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLGlCQUFpQixLQUFLLFVBQVUsUUFBUSxJQUFJLG1CQUFtQjtBQUFBLEVBQ2pFO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDWixTQUFTLENBQUMsU0FBUyxhQUFhLGFBQWEsVUFBVSxjQUFjO0FBQUEsRUFDdkU7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
