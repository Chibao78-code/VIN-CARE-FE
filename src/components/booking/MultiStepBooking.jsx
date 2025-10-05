import React, { useState } from 'react';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import SelectCenter from './steps/SelectCenter';
import SelectDate from './steps/SelectDate';
import SelectService from './steps/SelectService';
import SelectTimeSlot from './steps/SelectTimeSlot';
import ConfirmBooking from './steps/ConfirmBooking';
import BookingSuccess from './steps/BookingSuccess';

const MultiStepBooking = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    center: null,
    date: null,
    service: null,
    servicePackage: null,
    parts: [],
    problemDescription: '',
    timeSlot: null,
    vehicle: null,
    customerInfo: {
      name: '',
      phone: '',
      email: '',
      address: ''
    },
    notes: '',
    status: 'pending', // cho - xac nhan - dang thuc hien - hoan thanh
    bookingId: null
  });
    // tung buoc dat lich
  const steps = [
    { id: 1, name: 'Chọn trung tâm', component: SelectCenter },
    { id: 2, name: 'Chọn ngày', component: SelectDate },
    { id: 3, name: 'Chọn dịch vụ', component: SelectService },
    { id: 4, name: 'Chọn giờ', component: SelectTimeSlot },
    { id: 5, name: 'Xác nhận', component: ConfirmBooking },
    { id: 6, name: 'Hoàn tất', component: BookingSuccess }
  ];

  const handleNext = (data) => {
    setBookingData({ ...bookingData, ...data });
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setBookingData({
      center: null,
      date: null,
      service: null,
      servicePackage: null,
      parts: [],
      problemDescription: '',
      timeSlot: null,
      vehicle: null,
      customerInfo: {
        name: '',
        phone: '',
        email: '',
        address: ''
      },
      notes: '',
      status: 'pending',
      bookingId: null
    });
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  if (!isOpen) return null;

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-5xl transform transition-all">
          <div className="bg-gradient-to-br from-teal-700 via-teal-600 to-cyan-600 text-white rounded-t-2xl px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Đặt lịch dịch vụ VinFast</h2>
                <p className="text-sm text-teal-50 mt-1">
                  Bước {currentStep} / {steps.length - 1}: {steps[currentStep - 1].name}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            {currentStep < 6 && (
              <div className="mt-4 mb-2">
                <div className="flex items-center justify-between">
                  {steps.slice(0, 5).map((step, index) => (
                    <div key={step.id} className="flex items-center flex-1">
                      <div className="relative">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
                          ${currentStep > step.id 
                            ? 'bg-white text-teal-600 border-white' 
                            : currentStep === step.id 
                            ? 'bg-teal-500 text-white border-white' 
                            : 'bg-transparent text-teal-100 border-teal-300'}`}
                        >
                          {currentStep > step.id ? '✓' : step.id}
                        </div>
                        <span className={`absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs whitespace-nowrap text-center font-medium
                          ${currentStep >= step.id ? 'text-white' : 'text-teal-100'}`}
                        >
                          {step.name}
                        </span>
                      </div>
                      {index < steps.length - 2 && (
                        <div className={`flex-1 h-0.5 mx-2 
                          ${currentStep > step.id ? 'bg-white' : 'bg-teal-300'}`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="p-6" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            <CurrentStepComponent
              data={bookingData}
              onNext={handleNext}
              onBack={handleBack}
              currentStep={currentStep}
            />
          </div>
          {currentStep > 1 && currentStep < 6 && (
            <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
              <button
                onClick={handleBack}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <FiChevronLeft className="mr-2" />
                Quay lại
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiStepBooking;
