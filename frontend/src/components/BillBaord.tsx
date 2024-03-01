import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { useAppDispatch } from "../store/hooks";
import { openModal } from "../store/reducers/modalReducer";
import { useGetRandomQuery } from "../store/services/content-api";
import PlayButton from "./PlayButton";
import { useCallback } from "react";

const BillBaord = () => {
  const dispatch = useAppDispatch();
  const { data, error, isLoading } = useGetRandomQuery(null);

  const handleOpenModal = useCallback(() => {
    dispatch(openModal(data?._id!));
  }, [openModal, data?._id!]);
  console.log(data?.trailer)

  return (
    <div className="relative h-[56.25vw]">
      <video
        poster={data?.imgThumb}
        className="w-full h-[56.25vw] object-cover brightness-[60%] transition duration-500"
        autoPlay
        muted
        loop
        src={data?.trailer}
      ></video>
      <div className="absolute top-[30%] md:top-[40%] ml-4 md:ml-16">
        <p className="text-white text-1xl md:text-5xl h-full w-[50%] lg:text-6xl font-bold drop-shadow-xl">
          {data?.title}
        </p>
        <p className="text-white text-[8px] md:text-lg mt-3 md:mt-8 w-[90%] md:w-[80%] lg:w-[50%] drop-shadow-xl">
          {data?.description}
        </p>
        <div className="flex flex-row items-center mt-3 md:mt-4 gap-3">
          <PlayButton contentId={data?._id!} />
          <button
            onClick={handleOpenModal}
            className="
            bg-white
            text-white
              bg-opacity-30 
              rounded-md 
              py-1 md:py-2 
              px-2 md:px-4
              w-auto 
              text-xs lg:text-lg 
              font-semibold
              flex
              flex-row
              items-center
              hover:bg-opacity-20
              transition
            "
          >
            <InformationCircleIcon className="w-4 md:w-7 mr-1" />
            More Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillBaord;
