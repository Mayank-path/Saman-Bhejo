import mongoose, { Document, Schema } from "mongoose"

export interface IReview extends Document {
  shipment: mongoose.Types.ObjectId
  reviewer: mongoose.Types.ObjectId
  reviewee: mongoose.Types.ObjectId
  rating: number
  comment: string
  createdAt: Date
  updatedAt: Date
}

const ReviewSchema = new Schema<IReview>(
  {
    shipment: {
      type: Schema.Types.ObjectId,
      ref: "Shipment",
      required: [true, "Shipment is required"],
    },

    reviewer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Reviewer is required"],
    },

    reviewee: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Reviewee is required"],
    },

    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },

    comment: {
      type: String,
      trim: true,
      maxlength: [500, "Comment cannot exceed 500 characters"],
      default: "",
    },
  },
  {
    timestamps: true,
  }
)

ReviewSchema.index({ shipment: 1 })
ReviewSchema.index({ reviewer: 1 })
ReviewSchema.index({ reviewee: 1 })
ReviewSchema.index({ shipment: 1, reviewer: 1 }, { unique: true })

ReviewSchema.post("save", async function () {
  const User = mongoose.model("User")
  const Review = mongoose.model("Review")

  const reviews = await Review.aggregate([
    { $match: { reviewee: this.reviewee } },
    {
      $group: {
        _id: "$reviewee",
        avgRating:    { $avg: "$rating" },
        totalRatings: { $sum: 1 },
      },
    },
  ])

  if (reviews.length > 0) {
    await User.findByIdAndUpdate(this.reviewee, {
      rating:       parseFloat(reviews[0].avgRating.toFixed(1)),
      totalRatings: reviews[0].totalRatings,
    })
  }
})

const Review = mongoose.model<IReview>("Review", ReviewSchema)

export default Review   