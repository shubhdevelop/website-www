import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'website-www/tests/helpers';
import { EVENTS_CATEGORIES } from '../constants/events-data';
import { SOCIAL_LINK_PROPERTIES } from '../constants/social-data';

// TODO: Delete/Update tests when migration changes comes out of feature flag
module('Acceptance | migration changes under feature flag', function (hooks) {
  setupApplicationTest(hooks);

  test('Migrated footer should exists when dev=true', async function (assert) {
    await visit('/');

    assert.strictEqual(currentURL(), '/');

    assert.dom('[data-test-events-section]').doesNotExist();
    assert.dom('[data-test-footer-info]').doesNotExist();
    assert.dom('[data-test-sites-title]').exists();

    await visit('/?dev=true');

    assert.strictEqual(currentURL(), '/?dev=true');

    assert.dom('[data-test-sites-title]').doesNotExist();
    assert.dom('[data-test-events-section]').exists();
    assert.dom('[data-test-events-section-header]').exists();
    for (const eventCategory in EVENTS_CATEGORIES) {
      assert.dom(`[data-test-events-category="${eventCategory}"]`).exists();
      EVENTS_CATEGORIES[eventCategory].forEach((event) => {
        assert.dom(`[data-test-events-link="${event.name}"]`).exists();
      });
    }
    assert.dom('[data-test-footer-info]').exists();
    assert.dom('[data-test-footer-info-members-link]').exists();
    assert.dom('[data-test-footer-info-faq-link]').exists();
    assert.dom('[data-test-footer-repo-text-dev]').exists();
    assert.dom('[data-test-footer-repo-link-dev]').exists();
  });

  test('Migrated main section should exists when dev=true', async function (assert) {
    await visit('/');

    assert.strictEqual(currentURL(), '/');

    assert.dom('[data-test-main-hero-img]').doesNotExist();
    assert.dom('[data-test-main-welcome-title]').doesNotExist();
    assert.dom('[data-test-main-container]').doesNotExist();
    SOCIAL_LINK_PROPERTIES.forEach((social) => {
      assert
        .dom(`[data-test-social-link=${social.title}]`)
        .hasAttribute('href', `${social.url}`);
      assert.dom(`[data-test-social-icon=${social.title}]`).exists();
    });

    assert.dom('[data-test-vertical-separators]').exists({ count: 3 });

    await visit('/?dev=true');

    assert.strictEqual(currentURL(), '/?dev=true');

    assert.dom('[data-test-main-hero-img]').exists();
    assert.dom('[data-test-main-welcome-title]').exists();
    assert.dom('[data-test-main-container]').exists();
    SOCIAL_LINK_PROPERTIES.forEach((social) => {
      assert
        .dom(`[data-test-social-link=${social.title}]`)
        .hasAttribute('href', `${social.url}`);
      assert.dom(`[data-test-social-icon=${social.title}]`).exists();
    });
    assert.dom('[data-test-vertical-separators]').exists({ count: 3 });
  });
});
