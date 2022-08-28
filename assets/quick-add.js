
if (!customElements.get('quick-add-modal')) {
  customElements.define('quick-add-modal', class QuickAddModal extends ModalDialog {
    constructor() {
      super();
      this.modalContent = this.querySelector('[id^="QuickAddInfo-"]');
    }

    hide(preventFocus = false) {
      const cartNotification = document.querySelector('cart-notification');
      if (cartNotification) cartNotification.setActiveElement(this.openedBy);
      this.modalContent.innerHTML = '';
      
      if (preventFocus) this.openedBy = null;
      super.hide();
    }


    show(opener) {

      opener.setAttribute('aria-disabled', true);
      opener.classList.add('loading');
      opener.querySelector('.loading-overlay__spinner').classList.remove('hidden');

      fetch(opener.getAttribute('data-product-url'))
        .then((response) => response.text())
        .then((responseText) => {
          const responseHTML = new DOMParser().parseFromString(responseText, 'text/html');
          this.productElement = responseHTML.querySelector('section[id^="MainProduct-"]');
          this.preventDuplicatedIDs();
          this.removeDOMElements();
          this.setInnerHTML(this.modalContent, this.productElement.innerHTML);
          
          if (window.Shopify && Shopify.PaymentButton) {
            Shopify.PaymentButton.init();
          }

          if (window.ProductModel) window.ProductModel.loadShopifyXR();
          const handle = this.dataset.handle;
           fetch(`/products/${handle}.js`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json"
            }
          }).then((res) => {
            res.json()
            .then((data) =>{
              const devFetchAddToCart = async(cartData) => {
                const response = await fetch("/cart/add.js", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(cartData)
                })
                const data = await response.json();
                console.log(data);
                const cartNotification = document.querySelector('cart-notification');
                cartNotification.renderContents(data);
              };
              const devAddToCart = (e, item)=> {
                const cartObject = {
                  "items": 
                  [
                    {
                      "quantity": 1,
                      "id": item.variants[0].id,
                    }
                  ]
              };
              if(document.querySelector("#appstle_selling_plan_label_20").checked){
                const selector = document.querySelector("#appstle_selling_plan0");
                console.log("add to cart with selling plan", selector.value);
                cartObject.items[0].selling_plan = selector.value;
                devFetchAddToCart(cartObject);
              }
              else{
                devFetchAddToCart(cartObject);
              }
              super.hide()
              }
          const form = this.querySelector("form");
          form.removeAttribute("action");
          form.removeAttribute("method");
          const addToCart = this.querySelector("button.button");
          addToCart.type = "button";
          addToCart.addEventListener("click", ()=>{devAddToCart(form, data)}, false);
          form.insertAdjacentHTML("beforeend", `<div class="appstle_sub_widget" id="appstle_subscription_widget0"><div class="appstle_widget_title">Purchase Options</div><div class="appstle_subscription_wrapper"><div class="appstle_subscription_wrapper_option appstle_selected_background">
          <input type="radio" checked="" id="appstle_selling_plan_label_10" name="selling_plan" value="">
          <label for="appstle_selling_plan_label_10" class="appstle_radio_label">
            <span class="appstle_circle"><span class="appstle_dot"></span></span>
              <span class="appstle_one_time_text">One Time Purchase</span>
             </label>
          <span class="appstle_subscription_amount transcy-money">$${(data.price * .01).toFixed(2)}</span>
         </div><div class="appstle_subscription_wrapper_option appstle_include_dropdown ">
            <div class="appstle_subscription_radio_wrapper">
                <input type="radio" id="appstle_selling_plan_label_20" name="selling_plan" value="1824227425">
                <label for="appstle_selling_plan_label_20" class="appstle_radio_label">
                    <span class="appstle_circle"><span class="appstle_dot"></span></span>
                    <span class="appstle_subscribe_save_text">Subscribe and save</span>
                </label>
                <div class="appstle_subscription_amount_wrapper">
                  <span class="appstle_subscription_amount transcy-money">$${(data.price * .01*.95).toFixed(2)}</span>
                </div>
            </div>
            <div data-subscription="hide" class="appstle_subscribe_option appstle_hide_subsOption">
                <label for="appstle_selling_plan0" class="appstle_select_label">DELIVERY FREQUENCY</label>
                 <select id="appstle_selling_plan0" class="appstle_select">
                <option value="1824227425">Every 4 Weeks (<span class="transcy-money">$${(data.price * .01*.95).toFixed(2)}</span>/delivery)</option><option value="2719613025">Every 8 Weeks (<span class="transcy-money">$${(data.price * .01 *.95).toFixed(2)}</span>/delivery)</option></select><div class="appstleSelectedSellingPlanOptionDescription"></div>

            </div>
        </div></div><div data-appstle-icon="" class="appstle_tooltip_wrapper">
                        <svg width="90" height="90" viewBox="0 0 90 90" xmlns="http://www.w3.org/2000/svg" class="tooltip_subscription_svg">
                          <path d="M45 0C20.1827 0 0 20.1827 0 45C0 69.8173 20.1827 90 45 90C69.8173 90 90 69.8174 90 45C90.0056 44.6025 89.9322 44.2078 89.7839 43.8389C89.6357 43.47 89.4156 43.1342 89.1365 42.8511C88.8573 42.568 88.5247 42.3432 88.158 42.1897C87.7912 42.0363 87.3976 41.9573 87 41.9573C86.6024 41.9573 86.2088 42.0363 85.842 42.1897C85.4753 42.3432 85.1427 42.568 84.8635 42.8511C84.5844 43.1342 84.3643 43.47 84.2161 43.8389C84.0678 44.2078 83.9944 44.6025 84 45C84 66.5748 66.5747 84 45 84C23.4253 84 6 66.5747 6 45C6 23.4254 23.4253 6 45 6C56.1538 6 66.3012 10.5882 73.4375 18H65.4062C65.0087 17.9944 64.614 18.0678 64.2451 18.2161C63.8762 18.3643 63.5405 18.5844 63.2573 18.8635C62.9742 19.1427 62.7494 19.4753 62.596 19.842C62.4425 20.2088 62.3635 20.6024 62.3635 21C62.3635 21.3976 62.4425 21.7912 62.596 22.158C62.7494 22.5247 62.9742 22.8573 63.2573 23.1365C63.5405 23.4156 63.8762 23.6357 64.2451 23.7839C64.614 23.9322 65.0087 24.0056 65.4062 24H79.8125C80.6081 23.9999 81.3711 23.6838 81.9337 23.1212C82.4963 22.5586 82.8124 21.7956 82.8125 21V6.59375C82.821 6.18925 82.7476 5.78722 82.5966 5.41183C82.4457 5.03644 82.2205 4.69545 81.9344 4.40936C81.6483 4.12327 81.3073 3.898 80.9319 3.7471C80.5565 3.5962 80.1545 3.52277 79.75 3.53125C79.356 3.53941 78.9675 3.62511 78.6067 3.78344C78.2458 3.94177 77.9197 4.16963 77.6469 4.45402C77.3741 4.73841 77.16 5.07375 77.0168 5.44089C76.8737 5.80803 76.8042 6.19977 76.8125 6.59375V12.875C68.6156 4.86282 57.3081 0 45 0ZM43.75 20.75C43.356 20.7582 42.9675 20.8439 42.6067 21.0022C42.2458 21.1605 41.9197 21.3884 41.6469 21.6728C41.3741 21.9572 41.16 22.2925 41.0168 22.6596C40.8737 23.0268 40.8042 23.4185 40.8125 23.8125V47.375C40.8116 47.7693 40.8883 48.16 41.0385 48.5246C41.1886 48.8892 41.4092 49.2207 41.6875 49.5L54.0938 61.9375C54.6573 62.5011 55.4217 62.8177 56.2188 62.8177C57.0158 62.8177 57.7802 62.5011 58.3438 61.9375C58.9073 61.3739 59.224 60.6095 59.224 59.8125C59.224 59.0155 58.9073 58.2511 58.3438 57.6875L46.8125 46.1875V23.8125C46.821 23.408 46.7476 23.006 46.5966 22.6306C46.4457 22.2552 46.2205 21.9142 45.9344 21.6281C45.6483 21.342 45.3073 21.1168 44.9319 20.9658C44.5565 20.8149 44.1545 20.7415 43.75 20.75Z">
                          </path>
                        </svg>
                        <span class="appstle_tooltip_title">Subscription detail</span>
                        <div class="appstle_tooltip">
                          <div class="appstle_tooltip_content"><strong>Have complete control of your subscriptions</strong><br><br>Skip, reschedule, edit, or cancel deliveries anytime, based on your needs.</div>
                          <div class="appstle_tooltip_appstle">
                            <a href="https://appstle.com/" class="appstle_link" target="_blank">
                              POWERED BY APPSTLE
                            </a>
                          </div>
                                        </div>
                                      </div></div>`);
                                      document.querySelector("#appstle_selling_plan_label_10").addEventListener("click", (e)=> {
                                        if(e.target.checked){
                                          document.querySelector("[data-subscription='hide']").classList.add("appstle_hide_subsOption")
                                        }
                                      }, false)
                                      document.querySelector("#appstle_selling_plan_label_20").addEventListener("click", (e)=> {
                                        if(e.target.checked){
                                          document.querySelector("[data-subscription='hide']").classList.remove("appstle_hide_subsOption");
                                          form.insertAdjacentHTML("afterbegin", ` <input type="hidden" name="selling_plan" value="1824227425">`)
                                        }
                                      }, false)
                                    })
                                  })
          this.removeGalleryListSemantic();
          this.preventVariantURLSwitching();
          super.show(opener);
        })
        .finally(() => {
          opener.removeAttribute('aria-disabled');
          opener.classList.remove('loading');
          opener.querySelector('.loading-overlay__spinner').classList.add('hidden');
        });
    }

    setInnerHTML(element, html) {
      element.innerHTML = html;

      // Reinjects the script tags to allow execution. By default, scripts are disabled when using element.innerHTML.
      element.querySelectorAll('script').forEach(oldScriptTag => {
        const newScriptTag = document.createElement('script');
        Array.from(oldScriptTag.attributes).forEach(attribute => {
          newScriptTag.setAttribute(attribute.name, attribute.value)
        });
        newScriptTag?.appendChild(document.createTextNode(oldScriptTag.innerHTML));
        oldScriptTag?.parentNode?.replaceChild(newScriptTag, oldScriptTag);
      });
    }

    preventVariantURLSwitching() {
      this.modalContent.querySelector('variant-radios,variant-selects')?.setAttribute('data-update-url', 'false');
    }
    
    removeDOMElements() {
      const pickupAvailability = this.productElement.querySelector('pickup-availability');
      if (pickupAvailability) pickupAvailability.remove();

      const productModal = this.productElement.querySelector('product-modal');
      if (productModal) productModal.remove();
    }

    preventDuplicatedIDs() {
      const sectionId = this.productElement.dataset.section;
      this.productElement.innerHTML = this.productElement.innerHTML.replaceAll(sectionId, `quickadd-${ sectionId }`);
      this.productElement.querySelectorAll('variant-selects, variant-radios').forEach((variantSelect) => {
        variantSelect.dataset.originalSection = sectionId;
      });
    }

    removeGalleryListSemantic() {
      const galleryList = this.modalContent.querySelector('[id^="Slider-Gallery"]');
      if (!galleryList) return;

      galleryList.setAttribute('role', 'presentation');
      galleryList.querySelectorAll('[id^="Slide-"]').forEach(li => li.setAttribute('role', 'presentation'));
    }
  });
}
