import type { Schema, Struct } from '@strapi/strapi';

export interface SectionsCardList extends Struct.ComponentSchema {
  collectionName: 'components_sections_card_lists';
  info: {
    description: '';
    displayName: 'Card List';
    icon: 'list';
  };
  attributes: {
    cards: Schema.Attribute.Component<'shared.card', true>;
    title: Schema.Attribute.String;
    visibilityRules: Schema.Attribute.Component<
      'shared.visibility-rules',
      false
    >;
  };
}

export interface SectionsHero extends Struct.ComponentSchema {
  collectionName: 'components_sections_heroes';
  info: {
    description: '';
    displayName: 'Hero';
    icon: 'crown';
  };
  attributes: {
    backgroundImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    ctaLink: Schema.Attribute.String;
    ctaText: Schema.Attribute.String;
    heading: Schema.Attribute.String;
    subheading: Schema.Attribute.Text;
    visibilityRules: Schema.Attribute.Component<
      'shared.visibility-rules',
      false
    >;
  };
}

export interface SectionsLinkSection extends Struct.ComponentSchema {
  collectionName: 'components_sections_link_sections';
  info: {
    description: '';
    displayName: 'Link Section';
    icon: 'link';
  };
  attributes: {
    label: Schema.Attribute.String;
    linkType: Schema.Attribute.Enumeration<['internal', 'external']>;
    openInNewTab: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    url: Schema.Attribute.String;
    visibilityRules: Schema.Attribute.Component<
      'shared.visibility-rules',
      false
    >;
  };
}

export interface SharedCard extends Struct.ComponentSchema {
  collectionName: 'components_shared_cards';
  info: {
    description: '';
    displayName: 'Card';
    icon: 'id-card';
  };
  attributes: {
    description: Schema.Attribute.Text;
    link: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface SharedVisibilityRules extends Struct.ComponentSchema {
  collectionName: 'components_shared_visibility_rules';
  info: {
    description: '';
    displayName: 'VisibilityRules';
    icon: 'eye';
  };
  attributes: {
    enabled: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    endTime: Schema.Attribute.DateTime;
    regions: Schema.Attribute.JSON;
    requiresConsent: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    startTime: Schema.Attribute.DateTime;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'sections.card-list': SectionsCardList;
      'sections.hero': SectionsHero;
      'sections.link-section': SectionsLinkSection;
      'shared.card': SharedCard;
      'shared.visibility-rules': SharedVisibilityRules;
    }
  }
}
