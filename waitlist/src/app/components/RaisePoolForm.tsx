"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

type RaisePoolFormData = {
  type: "public" | "private";
  targetAmount: number;
  title: string;
  description: string;
  image: File | null;
  websiteLink: string;
  socials: {
    x: string;
    instagram: string;
    facebook: string;
    linkedin: string;
  };
  duration: number;
};

const RaisePoolForm = () => {
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<RaisePoolFormData>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: RaisePoolFormData) => {
    setLoading(true);
    const formData = new FormData();

    formData.append("type", data.type);
    formData.append("targetAmount", data.targetAmount.toString());
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("websiteLink", data.websiteLink);
    formData.append("duration", data.duration.toString());
    formData.append("socials[x]", data.socials.x);
    formData.append("socials[instagram]", data.socials.instagram);
    formData.append("socials[facebook]", data.socials.facebook);
    formData.append("socials[linkedin]", data.socials.linkedin);

    if (data.image) {
      formData.append("image", data.image);
    }

    try {
      const res = await fetch("/api/pool/create", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        reset();
        router.push("/dashboard");
      } else {
        console.error("Failed to create the pool");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white text-black rounded-md shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4">Raise a Pool</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select {...register("type")} className="w-full p-2 border rounded">
            <option value="public">Public</option>
            <option value="private">Only those with link</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Target Amount</label>
          <input
            type="number"
            {...register("targetAmount", { required: true })}
            className="w-full p-2 border rounded"
            placeholder="Target amount"
          />
          {errors.targetAmount && <p className="text-red-600 text-sm">This field is required.</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            {...register("title", { required: true })}
            className="w-full p-2 border rounded"
            placeholder="Title of the cause"
          />
          {errors.title && <p className="text-red-600 text-sm">This field is required.</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            {...register("description", { required: true })}
            className="w-full p-2 border rounded"
            placeholder="Describe the cause"
          ></textarea>
          {errors.description && <p className="text-red-600 text-sm">This field is required.</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Image</label>
          <input
            type="file"
            {...register("image")}
            onChange={(e) => setValue("image", e.target.files ? e.target.files[0] : null)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Website Link</label>
          <input
            type="url"
            {...register("websiteLink")}
            className="w-full p-2 border rounded"
            placeholder="https://example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Social Links</label>
          <div className="space-y-2">
            <input
              type="url"
              {...register("socials.x")}
              className="w-full p-2 border rounded"
              placeholder="X (Twitter) profile link"
            />
            <input
              type="url"
              {...register("socials.instagram")}
              className="w-full p-2 border rounded"
              placeholder="Instagram profile link"
            />
            <input
              type="url"
              {...register("socials.facebook")}
              className="w-full p-2 border rounded"
              placeholder="Facebook profile link"
            />
            <input
              type="url"
              {...register("socials.linkedin")}
              className="w-full p-2 border rounded"
              placeholder="LinkedIn profile link"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Duration (Days)</label>
          <input
            type="number"
            {...register("duration", { required: true })}
            className="w-full p-2 border rounded"
            placeholder="Duration in days"
          />
          {errors.duration && <p className="text-red-600 text-sm">This field is required.</p>}
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Pool"}
        </button>
      </form>
    </div>
  );
};

export default RaisePoolForm;
