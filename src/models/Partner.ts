/**
 * Modelo de Parceiro (PDV)
 * 
 * Implementar:
 * 1. Schema do MongoDB
 * 2. Interface TypeScript
 * 3. Adicionar índices geoespaciais para coverageArea e address
 * 4. Implementar validações dos campos
 */

import mongoose, { Document, Schema } from 'mongoose';

export interface IPartner extends Document {
  id: string;
  tradingName: string;
  ownerName: string;
  document: string;
  coverageArea: {
    type: string;
    coordinates: number[][][][];
  };
  address: {
    type: string;
    coordinates: number[];
  };
}

const PartnerSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  tradingName: {
    type: String,
    required: true,
    trim: true
  },
  ownerName: {
    type: String,
    required: true,
    trim: true
  },
  document: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  coverageArea: {
    type: {
      type: String,
      enum: ['MultiPolygon'],
      required: true
    },
    coordinates: {
      type: Array,
      required: true,
      validate: {
        validator: function(coords: any) {
          if (!Array.isArray(coords)) return false;
          return coords.every((polygon: any) => 
            Array.isArray(polygon) &&
            polygon.every((ring: any) =>
              Array.isArray(ring) &&
              ring.every((point: any) =>
                Array.isArray(point) &&
                point.length === 2 &&
                typeof point[0] === 'number' &&
                typeof point[1] === 'number' &&
                point[0] >= -180 && point[0] <= 180 &&
                point[1] >= -90 && point[1] <= 90
              )
            )
          );
        },
        message: 'Invalid MultiPolygon coordinates'
      }
    }
  },
  address: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: Array,
      required: true,
      validate: {
        validator: function(coords: any) {
          return Array.isArray(coords) &&
                 coords.length === 2 &&
                 typeof coords[0] === 'number' &&
                 typeof coords[1] === 'number' &&
                 coords[0] >= -180 && coords[0] <= 180 &&
                 coords[1] >= -90 && coords[1] <= 90;
        },
        message: 'Invalid coordinates: must be [longitude, latitude] array with valid ranges'
      }
    }
  }
}, {
  timestamps: true,
  versionKey: false,
  toJSON: {
    transform: (_doc: any, ret: any) => {
      delete ret._id;
      delete ret.createdAt;
      delete ret.updatedAt;
      return ret;
    }
  }
});

// Create 2dsphere indexes for geospatial queries
PartnerSchema.index({ 'address': '2dsphere' });
PartnerSchema.index({ 'coverageArea': '2dsphere' });

// Pre-save middleware to ensure GeoJSON structure
PartnerSchema.pre('save', function(next) {
  // Ensure address is a GeoJSON Point
  if (this.address && (!this.address.type || this.address.type !== 'Point')) {
    this.address.type = 'Point';
  }

  // Ensure coverageArea is a GeoJSON MultiPolygon
  if (this.coverageArea && (!this.coverageArea.type || this.coverageArea.type !== 'MultiPolygon')) {
    this.coverageArea.type = 'MultiPolygon';
  }

  next();
});

export const Partner = mongoose.model<IPartner>('Partner', PartnerSchema);