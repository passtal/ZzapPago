import { useState, useCallback } from "react";

/**
 * 국가 코드 → 주요 언어 매핑
 */
const COUNTRY_LANG_MAP: Record<string, string> = {
  KR: "ko",
  US: "en",
  GB: "en",
  AU: "en",
  CA: "en",
  JP: "ja",
  CN: "zh",
  TW: "zh",
  HK: "zh",
  ES: "es",
  MX: "es",
  AR: "es",
  CO: "es",
  FR: "fr",
  DE: "de",
  AT: "de",
  CH: "de",
  VN: "vi",
  TH: "th",
  RU: "ru",
  BR: "pt",
  PT: "pt",
  SA: "ar",
  AE: "ar",
  EG: "ar",
};

interface GeoLocationResult {
  latitude: number;
  longitude: number;
  countryCode: string | null;
  langCode: string | null;
}

export default function useGeoLocation() {
  const [location, setLocation] = useState<GeoLocationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detectLocation = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 1) 브라우저 Geolocation API로 GPS 좌표 획득
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000, // 5분 캐시
          });
        }
      );

      const { latitude, longitude } = position.coords;

      // 2) 역지오코딩으로 국가 코드 파악 (OpenStreetMap Nominatim - 무료)
      let countryCode: string | null = null;
      let langCode: string | null = null;

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&zoom=3`,
          {
            headers: {
              "Accept-Language": "en",
            },
          }
        );
        const data = await res.json();
        countryCode = data?.address?.country_code?.toUpperCase() ?? null;

        if (countryCode) {
          langCode = COUNTRY_LANG_MAP[countryCode] ?? null;
        }
      } catch {
        // 역지오코딩 실패해도 좌표는 사용 가능
      }

      const result: GeoLocationResult = {
        latitude,
        longitude,
        countryCode,
        langCode,
      };

      setLocation(result);
      return result;
    } catch (err) {
      const geoError = err as GeolocationPositionError;
      let message = "위치 정보를 가져올 수 없습니다.";

      if (geoError.code === 1) {
        message = "위치 권한이 거부되었습니다. 브라우저 설정에서 허용해주세요.";
      } else if (geoError.code === 2) {
        message = "위치 정보를 사용할 수 없습니다.";
      } else if (geoError.code === 3) {
        message = "위치 정보 요청 시간이 초과되었습니다.";
      }

      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { location, loading, error, detectLocation };
}
