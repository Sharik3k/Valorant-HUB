// vite.config.ts
import { defineConfig } from "file:///C:/Users/%D0%9C%D1%96%D0%B9%20%D0%9F%D0%9A/OneDrive/%D0%A0%D0%BE%D0%B1%D0%BE%D1%87%D0%B8%D0%B9%20%D1%81%D1%82%D1%96%D0%BB/valoranthub-devs-github-speckit/frontend/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/%D0%9C%D1%96%D0%B9%20%D0%9F%D0%9A/OneDrive/%D0%A0%D0%BE%D0%B1%D0%BE%D1%87%D0%B8%D0%B9%20%D1%81%D1%82%D1%96%D0%BB/valoranthub-devs-github-speckit/node_modules/@vitejs/plugin-react/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [react()],
  server: {
    port: 3e3,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxcdTA0MUNcdTA0NTZcdTA0MzkgXHUwNDFGXHUwNDFBXFxcXE9uZURyaXZlXFxcXFx1MDQyMFx1MDQzRVx1MDQzMVx1MDQzRVx1MDQ0N1x1MDQzOFx1MDQzOSBcdTA0NDFcdTA0NDJcdTA0NTZcdTA0M0JcXFxcdmFsb3JhbnRodWItZGV2cy1naXRodWItc3BlY2tpdFxcXFxmcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcXHUwNDFDXHUwNDU2XHUwNDM5IFx1MDQxRlx1MDQxQVxcXFxPbmVEcml2ZVxcXFxcdTA0MjBcdTA0M0VcdTA0MzFcdTA0M0VcdTA0NDdcdTA0MzhcdTA0MzkgXHUwNDQxXHUwNDQyXHUwNDU2XHUwNDNCXFxcXHZhbG9yYW50aHViLWRldnMtZ2l0aHViLXNwZWNraXRcXFxcZnJvbnRlbmRcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzLyVEMCU5QyVEMSU5NiVEMCVCOSUyMCVEMCU5RiVEMCU5QS9PbmVEcml2ZS8lRDAlQTAlRDAlQkUlRDAlQjElRDAlQkUlRDElODclRDAlQjglRDAlQjklMjAlRDElODElRDElODIlRDElOTYlRDAlQkIvdmFsb3JhbnRodWItZGV2cy1naXRodWItc3BlY2tpdC9mcm9udGVuZC92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtyZWFjdCgpXSxcbiAgc2VydmVyOiB7XG4gICAgcG9ydDogMzAwMCxcbiAgICBwcm94eToge1xuICAgICAgJy9hcGknOiB7XG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMScsXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZVxuICAgICAgfVxuICAgIH1cbiAgfVxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBOGYsU0FBUyxvQkFBb0I7QUFDM2hCLE9BQU8sV0FBVztBQUVsQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsRUFDakIsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBLFFBQ04sUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLE1BQ2hCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
