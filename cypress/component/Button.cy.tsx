import React from 'react';
import { Button } from '../../apps/web/src/components/ui/button';

describe('Button Component', () => {
  it('renders with default props', () => {
    cy.mount(<Button>Click me</Button>);
    cy.get('button').should('contain.text', 'Click me');
    cy.get('button').should('have.class', 'inline-flex');
  });

  it('renders with different variants', () => {
    cy.mount(
      <div>
        <Button variant="default">Default</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
    );

    cy.get('button').should('have.length', 6);
    cy.get('button').first().should('contain.text', 'Default');
  });

  it('renders with different sizes', () => {
    cy.mount(
      <div>
        <Button size="default">Default</Button>
        <Button size="sm">Small</Button>
        <Button size="lg">Large</Button>
        <Button size="icon">Icon</Button>
      </div>
    );

    cy.get('button').should('have.length', 4);
    cy.get('button').first().should('contain.text', 'Default');
  });

  it('handles click events', () => {
    const onClickSpy = cy.spy().as('onClickSpy');
    cy.mount(<Button onClick={onClickSpy}>Click me</Button>);

    cy.get('button').click();
    cy.get('@onClickSpy').should('have.been.calledOnce');
  });

  it('can be disabled', () => {
    cy.mount(<Button disabled>Disabled</Button>);
    cy.get('button').should('be.disabled');
    cy.get('button').should('contain.text', 'Disabled');
  });

  it('renders as a link when asChild is true', () => {
    cy.mount(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    );

    cy.get('a').should('have.attr', 'href', '/test');
    cy.get('a').should('contain.text', 'Link Button');
  });

  it('renders with icon', () => {
    cy.mount(
      <Button>
        <svg data-testid="icon" />
        Button with Icon
      </Button>
    );

    cy.get('[data-testid="icon"]').should('be.visible');
    cy.get('button').should('contain.text', 'Button with Icon');
  });

  it('applies custom className', () => {
    cy.mount(<Button className="custom-class">Custom</Button>);
    cy.get('button').should('have.class', 'custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>();
    cy.mount(<Button ref={ref}>Ref Test</Button>);

    cy.get('button').then($button => {
      expect(ref.current).to.equal($button[0]);
    });
  });
});
