import { SchemaTypes, Schema, model } from 'mongoose';

const productSchema = new Schema({
    productName: {
        type: SchemaTypes.String,
        required: true
    },
    productCode: {
        type: SchemaTypes.Number,
        required: true
    },
    productPrice: {
        type: SchemaTypes.Number,
        required: true
    },
    productDescription: {
        type: SchemaTypes.String,
        required: true
    },
    imageUrl: {
        type: SchemaTypes.String
    }
});

const Product = model('Product', productSchema);
export default Product;