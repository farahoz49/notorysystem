import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import AgreementInfo from "./AgreementInfo";
import ServiceDetails from "./ServiceDetails";
import PersonsWitnesses from "./PersonsWitnesses";
import { getAgreementWithService } from "../api/agreementDetails.api";
import { timeAgo } from "../helpers/timeAgo";

import Loader from "../components/ui/Loader";
import Button from "../components/ui/Button";

const ViewAgreementLayout = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [agreement, setAgreement] = useState(null);
  const [serviceData, setServiceData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dynamicTime, setDynamicTime] = useState("");

  // ✅ Smart time updater (fast at first, then slower)
  useEffect(() => {
    const updateTime = () => {
      const date = agreement?.createdAt || agreement?.agreementDate;
      if (!date) return;
      setDynamicTime(timeAgo(date));
    };

    updateTime();

    // 5 sec update initially, then ok UX without heavy CPU
    const interval = setInterval(updateTime, 5000);
    return () => clearInterval(interval);
  }, [agreement?.createdAt, agreement?.agreementDate]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const { agreement, serviceData } = await getAgreementWithService(id);
      setAgreement(agreement);
      setServiceData(serviceData);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error fetching agreement data");
      console.error(error);
      setAgreement(null);
      setServiceData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (isLoading) {
    return <Loader fullScreen text="Fadlan sug... xogta heshiiska waa soo socotaa" />;
  }

  if (!agreement) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl border border-black/10 shadow-sm p-6 text-center">
          <p className="text-lg font-semibold text-red-600">Agreement not found</p>
          <div className="mt-4 flex justify-center">
            <Button onClick={() => navigate(-1)}>Back</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white text-white p-5 rounded-2xl border border-white/10 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-black">agreement Details</h1>
            <p className="text-sm text-black/80 mt-1">
              Rep Nambar: <span className="font-semibold text-black">{agreement.refNo}</span> 
              </p>
          
            <p className="text-sm text-black/80 mt-1">
              Created by: <span className="text-black font-semibold">{agreement.createdBy?.username}</span>{" "}
              • {dynamicTime}
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="bg-black text-white "
          >
            Back to List
          </Button>
        </div>
      </div>

      {/* Sections */}
      <div className="bg-white rounded-2xl border border-black/10 shadow-sm p-4">
        <AgreementInfo agreement={agreement} fetchData={fetchData} />
      </div>

      <div className="bg-white rounded-2xl border border-black/10 shadow-sm p-4">
        <ServiceDetails
          agreement={agreement}
          serviceData={serviceData}
          setServiceData={setServiceData}
          fetchData={fetchData}
        />
      </div>

      <div className="bg-white rounded-2xl border border-black/10 shadow-sm p-4">
        <PersonsWitnesses agreement={agreement} fetchData={fetchData} />
      </div>
    </div>
  );
};

export default ViewAgreementLayout;
