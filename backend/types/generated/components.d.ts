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
    image: Schema.Attribute.Media<'images'>;
    link: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface SharedCondition extends Struct.ComponentSchema {
  collectionName: 'components_shared_conditions';
  info: {
    description: 'A single logical condition to evaluate';
    displayName: 'Condition';
    icon: 'filter';
  };
  attributes: {
    field: Schema.Attribute.String & Schema.Attribute.Required;
    operator: Schema.Attribute.Enumeration<
      [
        'equals',
        'not_equals',
        'in',
        'not_in',
        'contains',
        'not_contains',
        'greater_than',
        'less_than',
        'greater_than_or_equal',
        'less_than_or_equal',
        'starts_with',
        'ends_with',
        'intersects',
        'contains_all',
        'equals_set',
      ]
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'equals'>;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedOption extends Struct.ComponentSchema {
  collectionName: 'components_shared_options';
  info: {
    description: 'Options for choice-based questions';
    displayName: 'Option';
    icon: 'bullet-list';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedQuestion extends Struct.ComponentSchema {
  collectionName: 'components_shared_questions';
  info: {
    description: 'A question to ask the user';
    displayName: 'Question';
    icon: 'question';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    options: Schema.Attribute.Component<'shared.option', true>;
    type: Schema.Attribute.Enumeration<
      ['single_choice', 'multiple_choice', 'text', 'number']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'single_choice'>;
    variableName: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedTransition extends Struct.ComponentSchema {
  collectionName: 'components_shared_transitions';
  info: {
    description: 'Rule to determine the next screen';
    displayName: 'Transition';
    icon: 'arrow-right';
  };
  attributes: {
    conditions: Schema.Attribute.Component<'shared.condition', true>;
    targetScreen: Schema.Attribute.Relation<'oneToOne', 'api::screen.screen'>;
    type: Schema.Attribute.Enumeration<['AND', 'OR']> &
      Schema.Attribute.DefaultTo<'AND'>;
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
      'shared.condition': SharedCondition;
      'shared.option': SharedOption;
      'shared.question': SharedQuestion;
      'shared.transition': SharedTransition;
      'shared.visibility-rules': SharedVisibilityRules;
    }
  }
}
