import React, { useCallback } from 'react';

import { User as FirebaseUser } from 'firebase/auth';
import {
  Authenticator,
  buildCollection,
  buildProperty,
  EntityReference,
  FirebaseCMSApp
} from '@camberi/firecms';

import 'typeface-rubik';
import '@fontsource/ibm-plex-mono';

const firebaseConfig = {
  apiKey: "AIzaSyClEJZb4_hwK5nTboWoQ2l72eLV1sVXIVY",
  authDomain: "wildbags-demo-bundle-8267f.firebaseapp.com",
  projectId: "wildbags-demo-bundle-8267f",
  storageBucket: "wildbags-demo-bundle-8267f.appspot.com",
  messagingSenderId: "387992033973",
  appId: "1:387992033973:web:8c724ddfa56b4a200bbcfc"
};

type Product = {
  name: string;
  price: number;
  status: string;
  images: string[];
  description: string;
  features: string[];
  sizes: string[];
  categories: string[];
};

const productsCollection = buildCollection<Product>({
  name: 'Products',
  singularName: 'Product',
  path: 'products',
  permissions: ({ authController }) => ({
    edit: true,
    create: true,
    // we have created the roles object in the navigation builder
    delete: false
  }),
  properties: {
    name: {
      name: 'Nazwa',
      validation: { required: true },
      dataType: 'string'
    },
    price: {
      name: 'Cena',
      validation: {
        required: true,
        requiredMessage: 'Ustaw cenę produktu',
        min: 0,
        max: 10000
      },
      description: '0 - 10 000',
      dataType: 'number'
    },
    status: {
      name: 'Status',
      validation: { required: true },
      dataType: 'string',
      description: 'Określ czy produkt ma być widoczny na stronie',
      enumValues: {
        private: 'Widoczny',
        public: 'Ukryty'
      }
    },
    images: buildProperty({
      dataType: 'array',
      name: 'Zdjęcia',
      of: {
        dataType: 'string',
        storage: {
          storagePath: 'images',
          acceptedFiles: ['image/*'],
          metadata: {
            cacheControl: 'max-age=1000000'
          }
        }
      },
      description: 'Dodaj zdjęcia produktu w pożądanej kolejności'
    }),
    description: {
      name: 'Opis',
      description: 'Dodaj opis produktu',
      longDescription:
        'Example of a long description hidden under a tooltip. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin quis bibendum turpis. Sed scelerisque ligula nec nisi pellentesque, eget viverra lorem facilisis. Praesent a lectus ac ipsum tincidunt posuere vitae non risus. In eu feugiat massa. Sed eu est non velit facilisis facilisis vitae eget ante. Nunc ut malesuada erat. Nullam sagittis bibendum porta. Maecenas vitae interdum sapien, ut aliquet risus. Donec aliquet, turpis finibus aliquet bibendum, tellus dui porttitor quam, quis pellentesque tellus libero non urna. Vestibulum maximus pharetra congue. Suspendisse aliquam congue quam, sed bibendum turpis. Aliquam eu enim ligula. Nam vel magna ut urna cursus sagittis. Suspendisse a nisi ac justo ornare tempor vel eu eros.',
      dataType: 'string',
      columnWidth: 300
    },
    features: buildProperty({
      dataType: 'array',
      name: 'Właściwości',
      of: {
        dataType: 'string'
      },
      description: 'Dodaj właściwości produktu (lista właściwości)'
    }),
    sizes: buildProperty({
      dataType: 'array',
      name: 'Wymiary',
      of: {
        dataType: 'string'
      },
      description: 'Dodaj wymiary produktu (lista wymiarów z opisem)'
    }),
    categories: {
      name: 'Kategorie',
      validation: { required: true },
      dataType: 'array',
      of: {
        dataType: 'string',
        enumValues: {
          kosmetyczki: 'Kosmetyczki',
          torby: 'Torby'
        }
      }
    }
  }
});

export default function App() {
  const myAuthenticator: Authenticator<FirebaseUser> = useCallback(
    async ({ user, authController }) => {
      if (user?.email?.includes('flanders')) {
        throw Error('Stupid Flanders!');
      }

      console.log('Allowing access to', user?.email);
      // This is an example of retrieving async data related to the user
      // and storing it in the user extra field.
      const sampleUserRoles = await Promise.resolve(['admin']);
      authController.setExtra(sampleUserRoles);

      return true;
    },
    []
  );

  return (
    <FirebaseCMSApp
      name={'Wildbags'}
      authentication={myAuthenticator}
      collections={[productsCollection]}
      firebaseConfig={firebaseConfig}
    />
  );
}
