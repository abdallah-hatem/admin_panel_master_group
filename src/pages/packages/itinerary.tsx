import { Button, message } from 'antd';
import React, { useEffect, useState } from 'react';

import { ADD_ACTIVITY, UPDATE_ACTIVITY } from '@/api/activities';
import MapComp from '@/generic/components/basic/mapComp';
import MyModal from '@/generic/components/basic/modal';
import { getTitleWithDescription } from '@/generic/helpers/jsonForm';
import { useLocale } from '@/locales';

import ItineraryTable from './itineraryTable';
import MeetingPointsTable from './meetingPointsTable';
import UpdateItinerary from './updateItinerary';
import UpdateMeetingPoint from './updateMeetingPoint';

interface Props {
  next: () => void;
  setCreatedActivityId?: (data: any) => void;
  activityData: any;
  setReFetch?: (data?: any) => void;
  type?: 'itinerary' | 'meetingPoint';
  current?: number;
}

export default function Itinerary({
  next,
  setCreatedActivityId,
  activityData,
  setReFetch,
  type = 'itinerary',
  current,
}: Props) {
  const [markers, setMarkers] = useState<any[]>([]);
  const [center, setCenter] = useState<{ lat: number; lng: number }>({ lat: 38.7223, lng: -9.1393 });
  const [markerDetails, setMarkerDetails] = useState<any>(null);
  const [modalOpened, setModalOpened] = useState<boolean>(false);
  // const [form] = MyForm.useForm();

  const { formatMessage } = useLocale();

  useEffect(() => {
    if (current === 3) {
      const val = localStorage.getItem('meetingPoints');

      if (!val) return;

      const data = JSON.parse(val);

      if (type === 'meetingPoint') {
        setMarkers(
          data.meeting_points.map((el: any) => {
            return {
              ...el,
              lat: el.latitude,
              lng: el.longitude,
              name: el.name,
            };
          }),
        );
      } else {
        setMarkers(
          data.itineraries.map((el: any) => {
            return {
              ...el,
              lat: el.latitude,
              lng: el.longitude,
              transport_type: el._type,
            };
          }),
        );
      }
    }
  }, [current]);

  useEffect(() => {
    setReFetch && setReFetch((prev: any) => !prev);
  }, [type]);

  useEffect(() => {
    if (activityData) {
      console.log(activityData);

      if (type === 'meetingPoint') {
        setMarkers(
          activityData.meeting_points.map((el: any) => {
            return {
              ...el,
              lat: el.latitude,
              lng: el.longitude,
              name: el.name,
            };
          }),
        );
      } else {
        setMarkers(
          activityData.itineraries.map((el: any) => {
            return {
              ...el,
              lat: el.latitude,
              lng: el.longitude,
              transport_type: el._type,
            };
          }),
        );
      }
    }
  }, [activityData]);

  const triggerModal = () => setModalOpened(prev => !prev);

  function handleSubmit() {
    // localStorage.setItem('itinerary', JSON.stringify(markers));

    if (type === 'meetingPoint') {
      const val = {
        meeting_points: markers.map(el => {
          return {
            name: el.name,
            latitude: el.lat,
            longitude: el.lng,
          };
        }),
      };

      if (activityData) {
        localStorage.setItem('meetingPoints_update', JSON.stringify(val));

        UPDATE_ACTIVITY(activityData.id, val).then((res: any) => {
          if (res?.sucess) return message.error(res.result.message);
          message.success('Updated successfully');
          setReFetch && setReFetch((prev: boolean) => !prev);
          next();
        });
      } else {
        localStorage.setItem('meetingPoints', JSON.stringify(val));
      }

      if (!activityData) {
        setCenter({ lat: 38.7223, lng: -9.1393 });
        setMarkers([]);
      }

      return next();
    }

    let activity1: any = localStorage.getItem('activity1');
    let activity2: any = localStorage.getItem('activity2');
    let meetingPoints: any = localStorage.getItem('meetingPoints');
    let extraInformation: any = localStorage.getItem('extraInformation');

    if (activityData) {
      activity1 = localStorage.getItem('activity1_update');
      activity2 = localStorage.getItem('activity2_update');
      meetingPoints = localStorage.getItem('meetingPoints_update');
      extraInformation = localStorage.getItem('extraInformation_update');
    }

    activity1 = JSON.parse(activity1);
    activity2 = JSON.parse(activity2);
    meetingPoints = JSON.parse(meetingPoints);
    extraInformation = JSON.parse(extraInformation);

    const formatedItenerary = markers.map((el, index: number) => {
      delete el?.inserted_at;
      delete el?.id;

      const { lat, lng, transport_type, ...rest } = el;

      return {
        latitude: lat,
        longitude: lng,
        _type: transport_type,
        order: index + 1,
        ...rest,
      };
    });

    console.log(formatedItenerary);

    let value = {
      ...activity1,
      ...activity2,
      ...meetingPoints,
      ...extraInformation,
      itineraries: formatedItenerary.map(({ key, ...rest }) => rest),
    };

    console.log(value);

    if (activityData) {
      value = {
        itineraries: formatedItenerary.map(({ key, ...rest }) => rest),
      };

      return UPDATE_ACTIVITY(activityData.id, value).then((res: any) => {
        if (res?.sucess) return message.error(res.result.message);
        message.success('Updated successfully');
        setReFetch && setReFetch((prev: boolean) => !prev);
        next();
      });
    }

    ADD_ACTIVITY(value).then((res: any) => {
      if (res?.sucess) return message.error(res.result.message);

      setCreatedActivityId && setCreatedActivityId(res.id);

      message.success('Added successfully');
      localStorage.removeItem('activity1');
      localStorage.removeItem('activity2');
      localStorage.removeItem('meetingPoints');
      //   form.resetFields();
      next();
    });
  }

  function handleMarkerClick(data: any) {
    setMarkerDetails(data);
    triggerModal();
  }

  const onMarkerSet = (data: any) => handleMarkerClick(data);

  return (
    <div className="mb-10">
      <div className="w-[80%] mx-auto mb-3">
        {type === 'meetingPoint'
          ? getTitleWithDescription(
              formatMessage({ id: 'activities.form.activity_start' }),
              formatMessage({ id: 'activities.form.activity_start_desc' }),
            )
          : getTitleWithDescription(
              formatMessage({ id: 'activities.form.activity_itenrary' }),
              formatMessage({ id: 'activities.form.activity_itenrary_desc' }),
            )}
      </div>
      <div className="w-[80%] mx-auto mb-5">
        <MapComp
          allowSearch
          center={center}
          handleMarkerClick={handleMarkerClick}
          onMarkerSet={onMarkerSet}
          setMarkers={setMarkers}
          markers={markers}
        />
      </div>
      {type === 'itinerary' ? (
        <ItineraryTable data={markers} setCenter={setCenter} setMarkers={setMarkers} />
      ) : (
        <MeetingPointsTable data={markers} setCenter={setCenter} setMarkers={setMarkers} />
      )}

      <div className="flex justify-end">
        <Button type="primary" onClick={handleSubmit} className="mt-10">
          {formatMessage({ id: 'general.submit' })}
        </Button>
      </div>

      <MyModal
        title={type === 'itinerary' ? 'Update itinerary' : 'Update meeting points'}
        open={modalOpened}
        footer={[]}
        onCancel={() => {
          setMarkerDetails(null);
          triggerModal();
          setMarkers(prev => prev.filter((el: any) => el?.name || el?.title));
        }}
        width={'70%'}
      >
        {type === 'itinerary' ? (
          <UpdateItinerary data={markerDetails} setMarkers={setMarkers} triggerModal={triggerModal} markers={markers} />
        ) : (
          <UpdateMeetingPoint
            data={markerDetails}
            setMarkers={setMarkers}
            triggerModal={triggerModal}
            markers={markers}
          />
        )}
      </MyModal>
    </div>
  );
}
