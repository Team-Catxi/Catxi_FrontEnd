declare global {
  interface Window {
    kakao: any;
  }
}

let loadingPromise: Promise<typeof window.kakao> | null = null;

export function loadKakaoMap(): Promise<typeof window.kakao> {
  if (window.kakao && window.kakao.maps) {
    return Promise.resolve(window.kakao);
  }

  if (loadingPromise) return loadingPromise; 

  loadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${
      import.meta.env.VITE_KAKAO_JS_KEY
    }&libraries=services&autoload=false`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.kakao) {
        window.kakao.maps.load(() => {
          resolve(window.kakao);
        });
      } else {
        reject("Kakao SDK load failed");
      }
    };

    script.onerror = () => reject("Kakao SDK network error");
  });

  return loadingPromise;
}
