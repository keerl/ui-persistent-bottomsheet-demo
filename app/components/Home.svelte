<script lang="ts">
    import { Template } from 'svelte-native/components';
    import { onMount } from 'svelte';

    import { getJSON } from '@nativescript/core/http';

    interface Launch {
        name: string;
        patch: string;
        images: string[];
        date: Date;
        details: string;
    };

    let stepIndex = 0;
    let launches: any[] = [];
    let selectedLaunch: Launch;

	onMount(async () => {
        let tmpLaunches: Launch[] = [];
		const rawLaunches: any[] = await getJSON(`https://api.spacexdata.com/v3/launches/past?sort=flight_number&limit=20&order=desc`);

        rawLaunches.forEach((launch) => {
            if (launch.links.mission_patch_small && launch.links.flickr_images.length > 0) {
                tmpLaunches.push({
                    name: launch.mission_name,
                    patch: launch.links.mission_patch_small,
                    images: launch.links.flickr_images,
                    date: new Date(launch.launch_date_utc),
                    details: launch.details
                });
            }
        });

        launches = tmpLaunches;
	});

    function onLaunchTap(event: any) {
        selectedLaunch = launches[event.index];
        stepIndex = 1;
    }
</script>

<page>
    <actionBar title="SpaceX Launches" />
        
    <bottomsheet {stepIndex} steps={[0, 250, 475]} on:stepIndexChange={(e) => (stepIndex = e.value)} scrollViewId="scrollView" backdropColor="rgba(66, 66, 66, 0.66)">
        {#if launches.length > 0}
            <listView items="{launches}" on:itemTap="{onLaunchTap}">
                <Template let:item>
                    <gridLayout columns="auto, *" class="m-4">
                        <nsImg col="{0}" src="{item.patch}" class="mr-2" height="50" width="50" />
                        <stackLayout col={1} verticalAlignment="middle">
                            <label text="{item.name}" class="text-xl text-black" />
                            <label text="{item.date.toLocaleDateString('en-US')}" class="text-sm text-gray-700" />

                        </stackLayout>
                    </gridLayout>
                </Template>
            </listView>
        {:else}
            <label text="Loading SpaceX Launches..." class="text-xl text-black" horizontalAlignment="center" verticalAlignment="middle" />
        {/if}
        <gridlayout prop:bottomSheet class="bg-gray-700 rounded-t-xl" rows="475">
            <stackLayout row="0">
                {#if selectedLaunch}
                    <nsImg fadeDuration="1000" src="{selectedLaunch.images[0]}" stretch="aspectFill" class="rounded-t-xl" width="100%" height="200" loadMode="async" />
                    <stackLayout class="mx-2 mb-2">
                        <label text="{selectedLaunch.name}" class="text-xl text-white py-3" />
                        <label text="{selectedLaunch.date.toLocaleDateString('en-US')}" class="text-sm text-white italic pb-2" />
                        <label text="{selectedLaunch.details}" textWrap="true" class="text-white text-sm leading-none" />
                    </stackLayout>
                {/if}
            </stackLayout>
        </gridlayout>
    </bottomsheet>
</page>


<style>

</style>
