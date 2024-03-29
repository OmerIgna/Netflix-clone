import { useAppSelector } from "../store/hooks";
import { selectUser } from "../store/reducers/authReducer";
import { selectIsOpenModal } from "../store/reducers/modalReducer";
import ContentCard from "../components/ContentCard";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";

const MyList = () => {
  const user = useAppSelector(selectUser);
  const isOpen = useAppSelector(selectIsOpenModal);
  const { t } = useTranslation();

  return (
    <Layout showInfoModal={isOpen} showBillBoard={false}>
      <div className="absolute px-4 md:px-12 mt-20 space-y-8 ">
        <p className="text-white text-md md:text-xl lg:text-2xl font-semibold mb-10">
          {t("myList")}
        </p>
        <div className="grid grid-cols-5 gap-4">
          {user?.likedContent!.map((item) => (
            <ContentCard
              key={item._id}
              genre={item.genre}
              imgThumb={item.imgThumb}
              duration={item.duration}
              trailer={item.trailer}
              _id={item._id}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default MyList;
