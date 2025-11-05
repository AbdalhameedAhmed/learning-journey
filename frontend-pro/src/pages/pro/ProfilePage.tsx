import Spinner from "@/components/Spinner";
import { useGetMe } from "@/hooks/auth/useGetMe";
import { useUpdateProfile } from "@/hooks/auth/useUpdateProfile";
import clsx from "clsx";
import { Field, Form } from "react-final-form";

interface ProfileFormValues {
  first_name: string;
  last_name: string;
  profile_picture: File | string | null;
}

const ProfilePage = () => {
  const { me, isPending: isGetMePending } = useGetMe();
  const { updateProfile, isPending: isUpdatePending } = useUpdateProfile();

  const handleSubmit = async (values: ProfileFormValues) => {
    const formData = new FormData();

    formData.append("first_name", values.first_name);
    formData.append("last_name", values.last_name);

    if (values.profile_picture && values.profile_picture instanceof File) {
      formData.append("profile_picture", values.profile_picture);
    }

    updateProfile(formData);
  };

  const validate = (values: ProfileFormValues) => {
    const errors: Partial<ProfileFormValues> = {};

    if (!values.first_name?.trim()) {
      errors.first_name = "الاسم الأول مطلوب";
    }

    if (!values.last_name?.trim()) {
      errors.last_name = "الاسم الاخير مطلوب";
    }

    return errors;
  };

  if (isGetMePending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="border-primary/20 mx-auto mt-8 w-2xl rounded-lg border bg-white p-6 shadow-md dark:bg-slate-800">
      <h1 className="text-text text-text-normal mb-6 text-2xl font-bold">
        الملف الشخصي للمستخدم
      </h1>

      <Form<ProfileFormValues>
        initialValues={{
          first_name: me?.first_name || "",
          last_name: me?.last_name || "",
          profile_picture: me?.profile_picture || null,
        }}
        onSubmit={handleSubmit}
        validate={validate}
        render={({
          handleSubmit,
          form,
          submitting,
          pristine,
          hasValidationErrors,
        }) => {
          const isSubmitDisabled =
            submitting || isUpdatePending || pristine || hasValidationErrors;

          return (
            <form onSubmit={handleSubmit} className="text-text-small space-y-6">
              {/* First Name Field */}
              <div className="space-y-2">
                <label
                  htmlFor="first_name"
                  className="text-text text-text-small block font-medium"
                >
                  الاسم الأول
                </label>
                <Field
                  name="first_name"
                  component="input"
                  type="text"
                  className="border-primary/30 focus:ring-primary focus:border-primary text-text w-full rounded-md border px-3 py-2 shadow-sm focus:ring-2 focus:outline-none"
                />
                <Field
                  name="first_name"
                  subscription={{ error: true, touched: true }}
                  render={({ meta }) =>
                    meta.error && meta.touched ? (
                      <span className="text-sm text-red-500">{meta.error}</span>
                    ) : null
                  }
                />
              </div>

              {/* Last Name Field */}
              <div className="space-y-2">
                <label
                  htmlFor="last_name"
                  className="text-text block font-medium"
                >
                  الاسم الاخير
                </label>
                <Field
                  name="last_name"
                  component="input"
                  type="text"
                  className="border-primary/30 focus:ring-primary focus:border-primary text-text w-full rounded-md border px-3 py-2 text-[22px] shadow-sm focus:ring-2 focus:outline-none"
                />
                <Field
                  name="last_name"
                  subscription={{ error: true, touched: true }}
                  render={({ meta }) =>
                    meta.error && meta.touched ? (
                      <span className="text-sm text-red-500">{meta.error}</span>
                    ) : null
                  }
                />
              </div>

              {/* Profile Picture Field - RTL Optimized */}
              <div className="space-y-2">
                <label
                  htmlFor="profile_picture"
                  className="text-text block font-medium"
                >
                  الصورة الشخصية
                </label>
                <Field
                  name="profile_picture"
                  component={({ input: { value, onChange, ...input } }) => (
                    <div className="space-y-4" dir="rtl">
                      <div className="relative">
                        <input
                          {...input}
                          id="profile_picture"
                          type="file"
                          accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
                          onChange={({ target }) => onChange(target.files?.[0])}
                          className="hidden"
                        />
                        <label
                          htmlFor="profile_picture"
                          className="border-primary/30 dark:border-dark-primary/30 bg-primary/5 dark:bg-dark-primary/5 hover:bg-primary/10 dark:hover:bg-dark-primary/10 focus:ring-primary focus:border-primary text-text flex cursor-pointer items-center justify-between gap-3 rounded-md border px-4 py-3 shadow-sm transition-all duration-200 hover:shadow-md focus:ring-2 focus:outline-none"
                        >
                          <div className="flex items-center gap-2">
                            <svg
                              className="text-text h-5 w-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <span className="text-text text-base font-medium">
                              {value instanceof File
                                ? value.name
                                : "لم يتم اختيار صورة"}
                            </span>
                          </div>
                          <span className="bg-primary dark:bg-dark-primary rounded-md px-4 py-2 font-medium text-white transition-colors duration-200">
                            اختر صورة
                          </span>
                        </label>
                      </div>

                      {/* File type hints */}
                      <p className="text-text text-xs">
                        الملفات المسموحة: PNG, JPG, JPEG
                      </p>

                      {/* Current Image Preview */}
                      {value &&
                        typeof value === "string" &&
                        value.length > 0 && (
                          <div className="bg-primary/5 dark:bg-dark-primary/5 border-primary/20 dark:border-dark-primary/20 flex flex-col items-center space-y-3 rounded-lg border p-4">
                            <p className="text-text text-sm font-medium">
                              الصورة الحالية:
                            </p>
                            <img
                              src={value}
                              alt="الصورة الشخصية الحالية"
                              className="border-primary/30 h-32 w-32 rounded-full border-2 object-cover"
                            />
                          </div>
                        )}

                      {/* New Image Preview */}
                      {value instanceof File && (
                        <div className="bg-primary/10 dark:bg-dark-primary/10 border-primary/30 dark:border-dark-primary/30 flex flex-col items-center space-y-3 rounded-lg border p-4">
                          <p className="text-text text-sm font-medium">
                            معاينة الصورة المحددة:
                          </p>
                          <img
                            src={URL.createObjectURL(value)}
                            alt="معاينة الصورة الجديدة"
                            className="border-primary h-32 w-32 rounded-full border-2 object-cover"
                          />
                        </div>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* Form Actions */}
              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitDisabled}
                  className={clsx(
                    "bg-primary dark:bg-dark-primary focus:ring-primary text-text-normal flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 font-medium text-white transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-400",
                    {
                      "cursor-not-allowed opacity-50": isSubmitDisabled,
                    },
                    {
                      "cursor-pointer": !isSubmitDisabled,
                    },
                    {},
                  )}
                >
                  {isUpdatePending ? "يتم التحديث..." : "تحديث الملف الشخصي"}
                </button>

                <button
                  type="button"
                  onClick={() => form.reset()}
                  disabled={submitting || pristine}
                  className="border-primary/30 dark:border-dark-primary/30 text-text hover:bg-primary/5 dark:hover:bg-dark-primary/5 focus:ring-primary dark:focus:ring-dark-primary text-text-normal rounded-md border px-4 py-2 font-medium transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400"
                >
                  تراجع
                </button>
              </div>
            </form>
          );
        }}
      />
    </div>
  );
};

export default ProfilePage;
