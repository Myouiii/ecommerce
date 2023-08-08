import mongoose from 'mongoose';
import slugGenerator from 'mongoose-slug-updater';
import removeMultiSpace from './plugins/remove-multi-space.js';

const autoPopulateChildren = function (next) {
  const populateOpts = [
    {
      path: 'children',
      select: this._fields,
      model: 'Category'
    }
  ];

  this.populate(populateOpts)
  next();
};

const categorySchema = mongoose.Schema(
  {
    _id: mongoose.Types.ObjectId,
    order: { type: Number, require: true },

    name: { type: String, trim: true, required: true },
    slug: { type: String, slug: "name", slugPaddingSize: 2, unique: true },
    desc: { type: String, trim: true, required: false },

    image: { type: String, trim: true, required: false },
    coverImage: { type: String, trim: true, required: false },

    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    isHide: { type: Boolean, required: true, default: false },
    countProduct: { type: Number, required: true, default: 0, min: 0 },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
  },
  { timestamps: true, versionKey: false }
);

categorySchema.plugin(slugGenerator);
categorySchema.plugin(removeMultiSpace);
categorySchema
  .pre('findOne', autoPopulateChildren)
  .pre('find', autoPopulateChildren);

categorySchema.statics.generateOrder = async function () {
  const item = await this.findOne().select('order').sort('-order').lean().exec(); // sort by descending order get max
  const order = parseInt(item?.order, 10) || 0;
  return order + 1;
}

const categoryModel = mongoose.model('Category', categorySchema);
export default categoryModel;