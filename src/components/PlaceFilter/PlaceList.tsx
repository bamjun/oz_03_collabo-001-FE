/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import PlaceItem from './PlaceItem';
import { useFilterStore } from '../../store/filterStore';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import ScrollToTopButton from './ScrollToTopButton';

interface RegionType {
  id: number;
  region: string;
}

interface PlaceListProps {
  selectPlace?: string;
  uri?: string;
  place_regions: RegionType[];
}

interface PlaceData {
  id: number;
  store_image: string;
  is_bookmarked: boolean;
  place_region: number;
  place_subcategory: number;
  name: string;
  address: string;
  rating: number;
  comments_count: number;
}

const fetchPlaces = async (
  regionId: number | null,
  subCategoryId: number | null,
  latitude: number | null,
  longitude: number | null,
  isActive: boolean,
  page: number,
  selectPlace?: string,
  uri?: string
) => {
  let url = 'http://127.0.0.1:8000/places/';
  const params: any = {
    main_category: selectPlace,
    page,
    page_size: 10,
    place_region: regionId,
    place_subcategory: subCategoryId,
    latitude: latitude,
    longitude: longitude,
    is_active: isActive,
  };

  const options: any = { withCredentials: true };

  if (uri === 'bookmark') {
    url = 'http://127.0.0.1:8000/users/mypage/bookmark/';
  } else if (uri === 'my_comment') {
    url = 'http://127.0.0.1:8000/users/mypage/my-comment/';
  } else if (uri === 'view_history') {
    url = 'http://127.0.0.1:8000/users/mypage/view-history/';
  } else {
    options.params = params;
  }

  try {
    const response = await axios.get(url, options);
    return response.data;
  } catch (error) {
    console.error('정보 가져오기 실패:', error);
    return { results: [], next: null };
  }
};

const PlaceList: React.FC<PlaceListProps> = ({
  selectPlace,
  uri,
  place_regions,
}) => {
  const { regionId, subCategoryId, latitude, longitude, isActive } =
    useFilterStore();
  const [places, setPlaces] = useState<PlaceData[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const loadMorePlaces = async (initialLoad: boolean = false) => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchPlaces(
        regionId,
        subCategoryId,
        latitude,
        longitude,
        isActive,
        initialLoad ? 1 : page,
        selectPlace,
        uri
      );

      const newPlaces = response?.results?.results || [];

      if (initialLoad) {
        if (newPlaces.length === 0) {
          setError('해당하는 장소가 없습니다.');
          setHasMore(false);
          setPlaces([]);
        } else {
          setPlaces(newPlaces);
          setPage(2);
          setHasMore(!!response.next);
        }
      } else {
        if (newPlaces.length === 0) {
          setHasMore(false);
        } else {
          setPlaces((prevPlaces) => [...prevPlaces, ...newPlaces]);
          setPage((prevPage) => prevPage + 1);
          setHasMore(!!response.next);
        }
      }
    } catch (error) {
      console.error('장소 더 가져오기 실패:', error);
      setError('장소를 가져오는데 실패했습니다.');
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookmarkChange = (placeId: number) => {
    setPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== placeId)
    );
  };

  const { observerElem } = useInfiniteScroll(
    () => loadMorePlaces(false),
    hasMore && !isLoading
  );

  useEffect(() => {
    loadMorePlaces(true);
  }, [regionId, subCategoryId, latitude, longitude, isActive, selectPlace]);

  const getLocationName = (placeRegionId: number) => {
    const region = place_regions.find((region) => region.id === placeRegionId);
    return region ? region.region : 'Unknown';
  };

  return (
    <div className='h-[100vh]' ref={scrollContainerRef}>
      {error && !isLoading && !places.length && (
        <div className='text-red-500 py-4 text-center'>{error}</div>
      )}
      <div className='gap-[10px] py-2'>
        {places.map((place: PlaceData) => (
          <PlaceItem
            key={place.id}
            placeId={place.id}
            store_image={place.store_image}
            isBookmarked={place.is_bookmarked}
            place_region={place.place_region}
            locationName={getLocationName(place.place_region)}
            name={place.name}
            address={place.address}
            rating={place.rating}
            comments_count={place.comments_count}
            onBookmarkChange={handleBookmarkChange}
          />
        ))}
      </div>
      {isLoading && <div className='py-4 text-center'>가져오는 중...</div>}
      {hasMore && <div ref={observerElem} className='h-1' />}

      <ScrollToTopButton scrollContainerRef={scrollContainerRef} />
    </div>
  );
};

export default PlaceList;
