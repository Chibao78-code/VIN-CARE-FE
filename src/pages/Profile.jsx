import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  FiUser, FiMail, FiPhone, FiMapPin, FiCalendar,
  FiEdit2, FiSave, FiX, FiShield, FiSettings
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Profile = () => {
  const { user, updateUser } = useAuthStore();
  const [editingSection, setEditingSection] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      gender: user?.gender || 'male',
      birthday: user?.birthday || '',
      address: user?.address || '',
      email: user?.email || '',
      phone: user?.phone || ''
    }
  });

  const handleEdit = (section) => setEditingSection(section);

  const handleCancel = () => {
    reset();
    setEditingSection(null);
  };

  const onSubmitPersonal = async (data) => {
    try {
      const { name, gender, birthday, address } = data;
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateUser({ name, gender, birthday, address });
      toast.success('Cập nhật thông tin cá nhân thành công!');
      setEditingSection(null);
    } catch {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại!');
    }
  };

  const onSubmitContact = async (data) => {
    try {
      const { phone } = data;
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateUser({ phone });
      toast.success('Cập nhật thông tin liên lạc thành công!');
      setEditingSection(null);
    } catch {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl p-10">
        {/* Header: avatar + tên */}
        <header className="flex flex-col md:flex-row items-center md:items-start mb-10 gap-8">
          <div className="relative w-36 h-36 rounded-full border-4 border-blue-400 overflow-hidden shadow-md">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-100">
                <FiUser className="text-blue-400 text-7xl" />
              </div>
            )}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold text-gray-900">{user?.name || 'Tên Khách Hàng'}</h1>
            <p className="text-lg text-gray-500 mt-1">( Khách hàng )</p>
            {editingSection === 'personal' && (
              <Button variant="outline" className="mt-4">Thay đổi ảnh</Button>
            )}
          </div>
        </header>

        {/* nội dung */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Thông tin cá nhân */}
          <section className="lg:col-span-2">
            <Card className="rounded-2xl shadow-md min-h-[685px]">
              <Card.Header className="flex justify-between items-center">
                <Card.Title className="text-lg font-semibold text-gray-800">Thông Tin Cá Nhân</Card.Title>
                {editingSection !== 'personal' && (
                  <Button
                    className="text-blue-700"
                    size="sm"
                    variant="outline"
                    icon={<FiEdit2 />}
                    onClick={() => handleEdit('personal')}
                  >
                    Chỉnh sửa
                  </Button>
                )}
              </Card.Header>
              <Card.Content>
                <form onSubmit={handleSubmit(onSubmitPersonal)} className="space-y-5">
                  <Input
                    label="Họ và tên"
                    icon={<FiUser />}
                    disabled={editingSection !== 'personal'}
                    error={errors.name?.message}
                    {...register('name', { required: 'Vui lòng nhập họ tên' })}
                  />
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Giới tính</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 disabled:bg-gray-100"
                      disabled={editingSection !== 'personal'}
                      {...register('gender')}
                    >
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                    </select>
                  </div>
                  <Input
                    label="Ngày sinh"
                    icon={<FiCalendar />}
                    type="date"
                    disabled={editingSection !== 'personal'}
                    {...register('birthday')}
                  />
                  <Input
                    label="Địa chỉ"
                    icon={<FiMapPin />}
                    disabled={editingSection !== 'personal'}
                    {...register('address')}
                  />
                  {editingSection === 'personal' && (
                    <div className="flex justify-end gap-4 pt-2">
                      <Button variant="outline" onClick={handleCancel} icon={<FiX />}>Hủy</Button>
                      <Button type="submit" variant="primary" icon={<FiSave />}>Lưu thay đổi</Button>
                    </div>
                  )}
                </form>
              </Card.Content>
            </Card>
          </section>

          {/* Thông tin liên lạc + bảo mật */}
          <section className="space-y-8">
            <Card className="rounded-2xl shadow-md">
              <Card.Header className="flex justify-between items-center">
                <Card.Title className="text-lg font-semibold text-gray-800">Thông Tin Liên Lạc</Card.Title>
                {editingSection !== 'contact' && (
                  <Button
                    className="text-blue-700"
                    size="sm"
                    variant="outline"
                    icon={<FiEdit2 />}
                    onClick={() => handleEdit('contact')}
                  >
                    Chỉnh sửa
                  </Button>
                )}
              </Card.Header>
              <Card.Content>
                <form onSubmit={handleSubmit(onSubmitContact)} className="space-y-5">
                  <Input
                    label="Email"
                    icon={<FiMail />}
                    disabled
                    value={user?.email || ''}
                    helperText="Email không thể thay đổi."
                  />
                  <Input
                    label="Số điện thoại"
                    icon={<FiPhone />}
                    type="tel"
                    disabled={editingSection !== 'contact'}
                    error={errors.phone?.message}
                    {...register('phone', {
                      pattern: {
                        value: /^[0-9]{10,11}$/,
                        message: 'Số điện thoại không hợp lệ'
                      }
                    })}
                    helperText="Chúng tôi sẽ gọi để xác nhận lịch hẹn của bạn qua số này."
                  />
                  {editingSection === 'contact' && (
                    <div className="flex justify-end gap-4 pt-2">
                      <Button variant="outline" onClick={handleCancel} icon={<FiX />}>Hủy</Button>
                      <Button type="submit" variant="primary" icon={<FiSave />}>Lưu thay đổi</Button>
                    </div>
                  )}
                </form>
              </Card.Content>
            </Card>

            <Card className="rounded-2xl shadow-md">
              <Card.Header>
                <Card.Title className="text-lg font-semibold text-gray-800">Bảo Mật & Cài Đặt</Card.Title>
              </Card.Header>
              <Card.Content className="space-y-4">
                <Button variant="outline" className="w-full justify-center gap-2">
                  <FiShield /> <span>Đổi mật khẩu</span>
                </Button>
                <Button variant="outline" className="w-full justify-center gap-2">
                  <FiSettings /> <span>Bật xác thực 2 bước</span>
                </Button>
                <Button variant="outline" className="w-full justify-center gap-2">
                  <FiUser /> <span>Quản lý thiết bị đăng nhập</span>
                </Button>
              </Card.Content>
            </Card>
          </section>
        </div>

        {/* Thống kê tài khoản */}
        <section className="mt-12">
          <Card className="rounded-2xl shadow-md">
            <Card.Header>
              <Card.Title className="text-lg font-semibold text-gray-800">Thống Kê Tài Khoản</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-xl font-semibold text-gray-900">{user?.joinDate || '01/01/2024'}</div>
                  <div className="text-gray-500">Ngày tham gia</div>
                </div>
                <div>
                  <div className="text-xl font-semibold text-gray-900">{user?.vehicles || '2 xe'}</div>
                  <div className="text-gray-500">Tổng số xe</div>
                </div>
                <div>
                  <div className="text-xl font-semibold text-gray-900">{user?.appointments || '15'}</div>
                  <div className="text-gray-500">Lịch hẹn hoàn thành</div>
                </div>
                <div>
                  <div className="text-xl font-semibold text-teal-600">{user?.points || '250 điểm'}</div>
                  <div className="text-gray-500">Điểm thưởng</div>
                </div>
              </div>
            </Card.Content>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Profile;
